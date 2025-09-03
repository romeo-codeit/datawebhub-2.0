import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  name: string;
  level: number;
  delay?: number;
}

export default function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  const [animated, setAnimated] = useState(false);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setTimeout(() => {
            setAnimated(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (skillRef.current) {
      observer.observe(skillRef.current);
    }

    return () => observer.disconnect();
  }, [animated, delay]);

  return (
    <div ref={skillRef} className="skill-item">
      <div className="flex justify-between mb-2">
        <span 
          className="text-softNavy font-medium"
          data-testid={`skill-name-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        >
          {name}
        </span>
        <span 
          className="text-softNavy/70"
          data-testid={`skill-level-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        >
          {level}%
        </span>
      </div>
      <div className="skill-bar h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="skill-fill rounded-full transition-all duration-1000 ease-out h-full"
          style={{ 
            width: animated ? `${level}%` : '0%',
            background: 'linear-gradient(90deg, var(--warm-orange), var(--calm-blue))'
          }}
          data-testid={`skill-bar-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
        />
      </div>
    </div>
  );
}
