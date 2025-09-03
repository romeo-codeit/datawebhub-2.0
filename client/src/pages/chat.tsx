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
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useChat();

  useScrollReveal();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Trigger avatar animation
    setAvatarAnimation("talk");
    
    try {
      const response = await sendMessage(userMessage);
      
      // Set avatar animation based on response metadata
      if (response.metadata && typeof response.metadata === 'object' && 'animation' in response.metadata) {
        setAvatarAnimation((response.metadata as any).animation || "idle");
      }
      
      // Reset to idle after animation
      setTimeout(() => setAvatarAnimation("idle"), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      setAvatarAnimation("idle");
    }
  };

  const handleQuickAction = (action: string) => {
    let quickMessage = "";
    switch (action) {
      case "skills":
        quickMessage = "Tell me about your skills";
        break;
      case "projects":
        quickMessage = "Show me your recent projects";
        break;
      case "contact":
        quickMessage = "How can I contact you?";
        break;
      default:
        return;
    }
    setMessage(quickMessage);
  };

  return (
    <section id="chat" className="py-20 bg-darkPurple/20 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center mb-16 scroll-reveal">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-cyanPrimary mb-6">
            AI <span className="gradient-text">Chat</span>
          </h2>
          <p className="text-xl text-cyanPrimary/70 max-w-3xl mx-auto leading-relaxed">
            Chat with my AI assistant powered by advanced language models. Ask about my work, skills, or anything else!
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0 min-h-[600px]">
              {/* Avatar Section */}
              <div className="lg:col-span-2 bg-gradient-to-br from-cyanPrimary/20 to-purpleAccent/20 flex items-center justify-center p-8">
                <AvatarPlaceholder 
                  animation={avatarAnimation}
                  onAnimationChange={setAvatarAnimation}
                />
              </div>
              
              {/* Chat Interface */}
              <div className="lg:col-span-3 flex flex-col">
                <ChatInterface 
                  messages={messages}
                  isLoading={isLoading}
                  error={error || null}
                />
                
                {/* Chat Input */}
                <div className="p-6 border-t border-gray-200">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input 
                      type="text" 
                      placeholder="Ask me anything about Alex..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-darkPurple-200 focus:outline-none focus:ring-2 focus:ring-cyanPrimary focus:border-transparent bg-darkPurple-300 text-cyanPrimary"
                      disabled={isLoading}
                      data-testid="input-chat-message"
                    />
                    <Button 
                      type="submit" 
                      disabled={!message.trim() || isLoading}
                      className="bg-purpleAccent hover:bg-purpleAccent-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="button-send-message"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </form>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[
                      { key: "skills", label: "Tell me about skills" },
                      { key: "projects", label: "Show recent projects" },
                      { key: "contact", label: "How to contact?" }
                    ].map((action) => (
                      <Button
                        key={action.key}
                        onClick={() => handleQuickAction(action.key)}
                        variant="secondary"
                        size="sm"
                        className="px-3 py-1 bg-darkPurple-200 hover:bg-darkPurple-300 rounded-full text-xs text-cyanPrimary transition-all"
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
