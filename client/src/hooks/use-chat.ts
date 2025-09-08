import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage, Prompt } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useChat() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = localStorage.getItem('sessionId');

  // Fetch existing chat messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const response = await apiRequest('GET', `/api/chat/messages?sessionId=${sessionId}`);
      return response.json();
    },
    staleTime: 0, // Always fetch fresh for chat
    enabled: !!sessionId, // Only run the query if sessionId exists
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, prompts }: { message: string, prompts: Prompt[] }) => {
      if (!sessionId) throw new Error("Session ID not found");
      const response = await apiRequest('POST', '/api/chat', { message, prompts, sessionId });
      return response.json();
    },
    onSuccess: (data: { chatMessage: ChatMessage, audioContent: string | null }) => {
      const { chatMessage, audioContent } = data;
      // Update the cache with the new message
      queryClient.setQueryData<ChatMessage[]>(['/api/chat/messages', sessionId], (oldMessages = []) => {
        return [...oldMessages, chatMessage];
      });

      // Play audio if available
      if (audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play().catch(e => {
          console.error("Error playing audio:", e);
          toast({
            title: "Audio Error",
            description: "Could not play the generated audio.",
            variant: "destructive",
          });
        });
      }
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = useCallback(async (message: string, prompts: Prompt[]) => {
    return sendMessageMutation.mutateAsync({ message, prompts });
  }, [sendMessageMutation]);

  return {
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    isLoadingMessages,
  };
}