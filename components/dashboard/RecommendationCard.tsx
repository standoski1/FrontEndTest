"use client";

import { Recommendation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Archive, ArchiveRestore } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleArchiveStatus } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: toggleArchive } = useMutation({
    mutationFn: () => toggleArchiveStatus(recommendation?.recommendationId, !recommendation?.archived),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast({
        title: recommendation?.archived ? 'Recommendation unarchived' : 'Recommendation archived',
        description: 'The recommendation has been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update recommendation status.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-xl">{recommendation?.title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleArchive()}
          className="h-8 w-8"
        >
          {recommendation?.archived ? (
            <ArchiveRestore className="h-4 w-4" />
          ) : (
            <Archive className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{recommendation?.description}</p>
        <div className="flex flex-wrap gap-2">
          {recommendation?.providers?.map((provider) => (
            <Badge key={provider} variant="secondary">
              {provider}
            </Badge>
          ))}
          {recommendation?.frameworks?.map((framework) => (
            <Badge key={framework?.id} variant="outline">
              {framework?.name}
            </Badge>
          ))}
          <Badge
            variant="default"
            className={`
              ${recommendation?.class === 'Critical' && 'bg-red-500'}
              ${recommendation?.class === 'High' && 'bg-orange-500'}
              ${recommendation?.class === 'Medium' && 'bg-yellow-500'}
              ${recommendation?.class === 'Low' && 'bg-green-500'}
            `}
          >
            {recommendation?.class}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}