import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarPlaceholderProps {
  animation: string;
  onAnimationChange: (animation: string) => void;
}

const animations = [
  { key: "idle", label: "Idle" },
  { key: "wave", label: "Wave" },
  { key: "nod", label: "Nod" },
  { key: "talk", label: "Talk" },
  { key: "cheer", label: "Cheer" },
  { key: "backflip", label: "Backflip" }
];

export default function AvatarPlaceholder({ animation, onAnimationChange }: AvatarPlaceholderProps) {
  return (
    <div className="text-center">
      {/* 3D Avatar Placeholder */}
      <div 
        className={`w-48 h-48 mx-auto bg-gradient-to-br from-cyanPrimary to-purpleAccent rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
          animation === 'talk' ? 'animate-pulse-slow' :
          animation === 'wave' ? 'animate-bounce-slow' :
          animation === 'nod' ? 'animate-bounce' :
          animation === 'cheer' ? 'animate-bounce-slow scale-110' :
          animation === 'backflip' ? 'animate-spin' :
          'animate-pulse-slow'
        }`}
        data-testid="avatar-container"
        data-animation={animation}
      >
        <Bot className="text-white text-6xl w-16 h-16" />
      </div>
      
      <h3 className="font-heading text-xl font-semibold text-cyanPrimary mb-2">
        AI Assistant
      </h3>
      <p className="text-cyanPrimary/70 text-sm mb-6">
        Ready to help you! Current animation: <span className="font-medium capitalize">{animation}</span>
      </p>
      
      {/* Avatar Animation Controls */}
      <div className="space-y-2">
        <div className="text-xs text-cyanPrimary/60 font-medium mb-2">
          Animation Controls:
        </div>
        <div className="flex flex-wrap gap-1 justify-center max-w-48">
          {animations.map((anim) => (
            <Button
              key={anim.key}
              onClick={() => onAnimationChange(anim.key)}
              size="sm"
              variant={animation === anim.key ? "default" : "secondary"}
              className={`px-2 py-1 text-xs transition-all ${
                animation === anim.key 
                  ? 'bg-purpleAccent text-white hover:bg-purpleAccent-600' 
                  : 'bg-darkPurple-200/20 hover:bg-darkPurple-200/30 text-cyanPrimary'
              }`}
              data-testid={`avatar-animation-${anim.key}`}
            >
              {anim.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
