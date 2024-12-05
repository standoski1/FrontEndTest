"use client";

import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendations, toggleArchiveStatus } from '@/lib/api';
import { RecommendationList } from '@/components/dashboard/RecommendationList';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { FilterPanel } from '@/components/dashboard/FilterPanel';
import { Button } from '@/components/ui/button';
import { Archive, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import withAuth from '../WithAuth';
import { Recommendation, PaginatedResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    getNextPageParam: (lastPage:any) => lastPage?.pagination?.cursor?.next,
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Fixed Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Security Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsArchiveView(!isArchiveView)}
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  {isArchiveView ? 'View Active' : 'View Archived'}
                </Button>
                <SearchBar value={search} onChange={setSearch} className="w-64" />
              </div>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <SearchBar value={search} onChange={setSearch} className="w-full" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsArchiveView(!isArchiveView);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <Archive className="h-4 w-4" />
                      {isArchiveView ? 'View Active' : 'View Archived'}
                    </Button>
                    <Card>
                      <CardHeader>
                        <CardTitle>Filters</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FilterPanel
                          selectedTags={selectedTags}
                          onTagsChange={(tags) => {
                            setSelectedTags(tags);
                            setIsMobileMenuOpen(false);
                          }}
                          availableTags={data?.pages[0]?.availableTags}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 pt-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sticky Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:w-1/4">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <FilterPanel
                    selectedTags={selectedTags}
                    onTagsChange={setSelectedTags}
                    availableTags={data?.pages[0]?.availableTags}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scrollable Recommendations */}
          <div className="md:w-3/4 w-full">
            <Tabs defaultValue="recommendations" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[calc(100vh-220px)] overflow-y-auto">
                    <RecommendationList
                      recommendations={data?.pages?.flatMap((page:any) => page.data) ?? []}
                      isLoading={isLoading}
                      isFetchingNextPage={isFetchingNextPage}
                      hasNextPage={!!hasNextPage}
                      onLoadMore={() => fetchNextPage()}
                      onToggleArchive={handleToggleArchive}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Overview content goes here...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);

