import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Loader2 } from "lucide-react";
import AvatarPlaceholder from "@/components/avatar-placeholder";
import ChatInterface from "@/components/chat-interface";
import { useChat } from "@/hooks/use-chat";
import { useScrollReveal } from "@/lib/animations";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [avatarAnimation, setAvatarAnimation] = useState("idle");
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useChat();

  useScrollReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    setAvatarAnimation("talk");
    
    try {
      const response = await sendMessage(userMessage);
      const metadata = response.metadata as any;
      if (metadata?.animation) {
        setAvatarAnimation(metadata.animation);
      }
      setTimeout(() => setAvatarAnimation("idle"), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      setAvatarAnimation("idle");
    }
  };

  return (
    <section id="chat" className="py-24 sm:py-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-20 scroll-reveal">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            AI <span className="text-primary">Chat</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Chat with my AI assistant powered by advanced language models. Ask about my work, skills, or anything else!
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border rounded-2xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0 min-h-[80vh] lg:min-h-[70vh]">
              {/* Avatar Section */}
              <div className="lg:col-span-2 bg-secondary flex items-center justify-center p-8 border-r">
                <AvatarPlaceholder 
                  animation={avatarAnimation}
                  onAnimationChange={setAvatarAnimation}
                />
              </div>
              
              {/* Chat Interface */}
              <div className="lg:col-span-3 flex flex-col bg-background">
                <ChatInterface 
                  messages={messages}
                  isLoading={isLoading}
                  error={error || null}
                />
                
                {/* Chat Input */}
                <div className="p-4 sm:p-6 border-t bg-card">
                  <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                    <Input 
                      type="text" 
                      placeholder="Ask me anything..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 h-12 px-4 rounded-lg"
                      disabled={isLoading}
                      data-testid="input-chat-message"
                    />
                    <Button 
                      type="submit" 
                      size="icon"
                      disabled={!message.trim() || isLoading}
                      className="h-12 w-12 rounded-lg"
                      data-testid="button-send-message"
                    >
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </Button>
                  </form>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { key: "skills", label: "Skills" },
                      { key: "projects", label: "Projects" },
                      { key: "contact", label: "Contact" }
                    ].map((action) => (
                      <Button
                        key={action.key}
                        onClick={() => setMessage(`Tell me about your ${action.key}`)}
                        variant="secondary"
                        size="sm"
                        className="px-4 py-2 rounded-full text-sm"
                        data-testid={`quick-action-${action.key}`}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
