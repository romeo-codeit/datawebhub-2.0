import { Bot } from "lucide-react";

interface AvatarPlaceholderProps {
  animation: string;
  onAnimationChange: (animation: string) => void;
}

import { Button } from "@/components/ui/button";

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
        className={`w-56 h-56 mx-auto bg-primary rounded-full flex items-center justify-center mb-6 transition-all duration-500 transform-gpu
          ${animation === 'talk' ? 'animate-pulse-slow' : ''}
          ${animation === 'wave' ? 'animate-bounce-slow' : ''}
          ${animation === 'nod' ? 'animate-bounce' : ''}
          ${animation === 'cheer' ? 'animate-bounce-slow scale-110' : ''}
          ${animation === 'backflip' ? 'animate-spin' : ''}
        `}
        style={{ perspective: '1000px' }}
        data-testid="avatar-container"
        data-animation={animation}
      >
        <Bot
          className="text-primary-foreground w-24 h-24 transition-all duration-500"
          style={{ transform: animation === 'backflip' ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        />
      </div>
      
      <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
        AI Assistant
      </h3>
      <p className="text-muted-foreground text-base mb-6">
        Ready to help you! Current animation: <span className="font-medium capitalize">{animation}</span>
      </p>

      {/* Avatar Animation Controls */}
      <div className="space-y-2">
        <div className="text-xs text-muted-foreground font-medium mb-2">
          Animation Controls:
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {animations.map((anim) => (
            <Button
              key={anim.key}
              onClick={() => onAnimationChange(anim.key)}
              size="sm"
              variant={animation === anim.key ? "secondary" : "ghost"}
              className="px-3 py-1 text-xs"
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
