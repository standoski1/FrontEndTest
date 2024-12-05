"use client";

import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendations, toggleArchiveStatus } from '@/lib/api';
import { RecommendationList } from '@/components/dashboard/RecommendationList';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { Button } from '@/components/ui/button';
import { Archive } from 'lucide-react';
import withAuth from '../WithAuth';
// import { Recommendation, PaginatedResponse } from '@/types';

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isArchiveView, setIsArchiveView] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['recommendations', search, selectedTags, isArchiveView],
    queryFn: ({ pageParam }) =>
      getRecommendations({
        cursor: pageParam as string | undefined,
        limit: 10,
        search,
        tags: selectedTags,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.pagination.cursor.next,
  });

  const toggleArchiveMutation = useMutation({
    mutationFn: ({ id, archive }: { id: string; archive: boolean }) =>
      toggleArchiveStatus(id, archive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });

  const handleToggleArchive = (id: string, currentStatus: boolean) => {
    toggleArchiveMutation.mutate({ id, archive: !currentStatus });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="min-[480px]:flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold max-[480px]:text-[18px] max-[480px]:pb-3">Security Recommendations</h1>
        <Button
          variant="outline"
          onClick={() => setIsArchiveView(!isArchiveView)}
          className="flex items-center gap-2"
        >
          <Archive className="h-4 w-4" />
          {isArchiveView ? 'View Active' : 'View Archived'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FilterPanel
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            availableTags={data?.pages[0]?.availableTags}
          />
        </div>

        <div className="lg:col-span-3">
          <SearchBar value={search} onChange={setSearch} className="mb-6" />
          
          <RecommendationList
            recommendations={data?.pages.flatMap((page) => page.data) ?? []}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={!!hasNextPage}
            onLoadMore={() => fetchNextPage()}
            onToggleArchive={handleToggleArchive}
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);

