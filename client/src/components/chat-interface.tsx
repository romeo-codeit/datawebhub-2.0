import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export default function ChatInterface({ messages, isLoading, error }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load chat</p>
          <p className="text-softNavy/70 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-96" data-testid="chat-messages">
      {/* Initial AI Message */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-cyanPrimary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-darkPurple-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
          <p className="text-cyanPrimary text-sm">
            Hi! I'm Alex's AI assistant. Feel free to ask me about his projects, skills, or experience!
          </p>
        </div>
      </div>

      {/* Dynamic Messages */}
      {messages.map((msg, index) => (
        <div key={msg.id}>
          {/* User Message */}
          <div className="flex items-start gap-3 flex-row-reverse mb-4">
            <div className="w-8 h-8 bg-purpleAccent rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="bg-purpleAccent/20 rounded-2xl rounded-tr-sm px-4 py-3 max-w-sm">
              <p 
                className="text-softNavy text-sm"
                data-testid={`user-message-${index}`}
              >
                {msg.message}
              </p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-cyanPrimary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-darkPurple-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
              <p 
                className="text-softNavy text-sm"
                data-testid={`ai-response-${index}`}
              >
                {msg.response}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-cyanPrimary rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-darkPurple-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyanPrimary/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-softNavy/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-softNavy/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
