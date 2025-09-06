import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, RefreshCw } from "lucide-react";
import ChatInterface from "@/components/chat-interface";
import { useChat } from "@/hooks/use-chat";
import { usePrompts } from "@/hooks/use-prompts";
import Avatar3D from "@/components/avatar-3d";

export default function Chat() {
  const [message, setMessage] = useState("");
  const modelRef = useRef();
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useChat();

  const { data: prompts, isLoading: isLoadingPrompts } = usePrompts();

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.response && modelRef.current) {
      try {
        const metadata = JSON.parse(lastMessage.metadata);
        if (metadata && metadata.animation) {
          modelRef.current.playAnimation(metadata.animation);
        }
      } catch (e) {
        console.error("Failed to parse message metadata:", e);
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || isLoadingPrompts) return;

    const userMessage = message.trim();
    setMessage("");
    
    try {
      await sendMessage(userMessage, prompts || []);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleNewChat = () => {
    localStorage.removeItem('sessionId');
    window.location.reload();
  };

  return (
    <section id="chat" className="py-24 sm:py-32 bg-background min-h-screen">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 relative">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            AI <span className="text-primary">Chat</span>
          </h2>
          <Button onClick={handleNewChat} variant="outline" size="icon" className="absolute top-0 right-0 m-4">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Chat with my AI assistant powered by advanced language models. Ask about my work, skills, or anything else!
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row h-[85vh]">
            {/* Avatar Section */}
            <div className="md:w-2/5 bg-secondary border-b md:border-b-0 md:border-r h-64 md:h-auto">
              <Avatar3D ref={modelRef} />
            </div>

            {/* Chat Section */}
            <div className="md:w-3/5 flex flex-col flex-1 bg-background overflow-hidden">
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
                    disabled={isLoading || isLoadingPrompts}
                    data-testid="input-chat-message"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim() || isLoading || isLoadingPrompts}
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
    </section>
  );
}