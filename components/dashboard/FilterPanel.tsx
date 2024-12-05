"use client";

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CloudProvider, RecommendationClass } from '@/types';

interface FilterPanelProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags?: {
    frameworks: string[];
    reasons: string[];
    providers: CloudProvider[];
    classes: RecommendationClass[];
  };
}

export function FilterPanel({ selectedTags, onTagsChange, availableTags }: FilterPanelProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  if (!availableTags) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Cloud Providers</h3>
        <ScrollArea className="h-[100px]">
          <div className="space-y-2">
            {availableTags?.providers?.map((provider) => (
              <Badge
                key={provider}
                variant={selectedTags?.includes(provider) ? 'default' : 'outline'}
                className="mr-2 cursor-pointer"
                onClick={() => toggleTag(provider)}
              >
                {provider}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="font-medium mb-3">Risk Level</h3>
        <ScrollArea className="h-[100px]">
          <div className="space-y-2">
            {availableTags?.classes?.map((riskClass) => (
              <Badge
                key={riskClass}
                variant={selectedTags?.includes(riskClass) ? 'default' : 'outline'}
                className="mr-2 cursor-pointer"
                onClick={() => toggleTag(riskClass)}
              >
                {riskClass}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div>
        <h3 className="font-medium mb-3">Frameworks</h3>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {availableTags?.frameworks?.map((framework) => (
              <Badge
                key={framework}
                variant={selectedTags?.includes(framework) ? 'default' : 'outline'}
                className="mr-2 cursor-pointer"
                onClick={() => toggleTag(framework)}
              >
                {framework}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}