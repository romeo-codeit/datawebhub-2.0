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
          <p className="text-destructive mb-2">Failed to load chat</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto" data-testid="chat-messages">
      {/* Initial AI Message */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6 text-secondary-foreground" />
        </div>
        <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 max-w-md">
          <p className="text-muted-foreground">
            Hi! I'm an AI assistant. Feel free to ask me about projects, skills, or experience!
          </p>
        </div>
      </div>

      {/* Dynamic Messages */}
      {messages.map((msg, index) => (
        <div key={msg.id} className="space-y-6">
          {/* User Message */}
          <div className="flex items-start gap-4 flex-row-reverse">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="bg-primary rounded-xl rounded-tr-none px-4 py-3 max-w-md">
              <p 
                className="text-primary-foreground"
                data-testid={`user-message-${index}`}
              >
                {msg.message}
              </p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 max-w-md">
              <p 
                className="text-muted-foreground"
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
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div className="bg-muted rounded-xl rounded-tl-none px-4 py-3 max-w-sm">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2.5 h-2.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
