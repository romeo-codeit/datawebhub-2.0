import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export function useChat() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch existing chat messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages'],
    staleTime: 0, // Always fetch fresh for chat
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message });
      return response.json();
    },
    onSuccess: (newMessage: ChatMessage) => {
      // Update the cache with the new message
      queryClient.setQueryData<ChatMessage[]>(['/api/chat/messages'], (oldMessages = []) => {
        return [...oldMessages, newMessage];
      });
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to send message');
    },
  });

  const sendMessage = useCallback(async (message: string) => {
    setError(null);
    return sendMessageMutation.mutateAsync(message);
  }, [sendMessageMutation]);

  return {
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
    isLoadingMessages,
    error: error || (sendMessageMutation.error?.message),
  };
}
