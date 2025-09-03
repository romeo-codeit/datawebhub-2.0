import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export function useProjects(category?: string) {
  const endpoint = category && category !== 'all' 
    ? `/api/projects/category/${category}`
    : '/api/projects';

  return useQuery<Project[]>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ['/api/projects/featured'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
