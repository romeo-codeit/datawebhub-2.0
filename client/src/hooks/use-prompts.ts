import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Prompt } from "@shared/schema";

export function usePrompts() {
  return useQuery<Prompt[]>({ 
    queryKey: ['/api/prompts'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/prompts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
