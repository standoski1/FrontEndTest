export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export type RecommendationClass = 'Critical' | 'High' | 'Medium' | 'Low';

export type Framework = {
  id: string;
  name: string;
  version: string;
};

export interface Recommendation {
  recommendationId: string;
  title: string;
  description: string;
  score: number;
  providers: CloudProvider[];
  frameworks: Framework[];
  reasons: string[];
  class: RecommendationClass;
  impact: {
    violationsPerMonth: number;
    valueScore: number;
  };
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor: {
      next: string | null;
    };
    totalItems: number;
  };
  availableTags: {
    frameworks: string[];
    reasons: string[];
    providers: CloudProvider[];
    classes: RecommendationClass[];
  };
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}