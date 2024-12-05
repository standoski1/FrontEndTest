"use client";

import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Recommendation } from '@/types';
import { RecommendationCard } from './RecommendationCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RecommendationListProps {
  recommendations: Recommendation[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onLoadMore: () => void;
}

export function RecommendationList({
  recommendations,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: RecommendationListProps) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No recommendations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <RecommendationCard key={recommendation.recommendationId} recommendation={recommendation} />
      ))}
      {hasNextPage && (
        <div ref={ref} className="py-4">
          {isFetchingNextPage && (
            <Skeleton className="h-48 w-full rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}

