import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import type { Project } from "@shared/schema";

// IMPORTANT: Replace with your actual Appwrite Database ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
const PROJECTS_COLLECTION_ID = 'projects';

export function useProjects(category?: string) {
  return useQuery<Project[]>({ 
    queryKey: ['projects', category || 'all'],
    queryFn: async () => {
      const queries = [];
      if (category && category !== 'all') {
        // Appwrite's Query.equal on an array attribute checks for containment
        queries.push(Query.equal('technologies', category));
      }
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        queries
      );
      return response.documents as unknown as Project[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({ 
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_COLLECTION_ID,
        [Query.equal('isFeatured', true)]
      );
      return response.documents as unknown as Project[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}