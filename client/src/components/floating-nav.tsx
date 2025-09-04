import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, User, Briefcase, Bot, Underline } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/about", icon: User, label: "About" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
  { href: "/chat", icon: Bot, label: "AI Chat" },
];

export default function FloatingNav() {
  const [location] = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="floating-nav hidden md:flex">
      <div className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <div 
              key={item.href}
              className="nav-item relative"
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link href={item.href}>
                <button
                  className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 group ${
                    isActive 
                      ? 'bg-secondary text-secondary-foreground scale-110 shadow-lg'
                      : 'bg-card text-foreground/70 hover:bg-primary hover:text-primary-foreground border'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </Link>
              
              {/* Tooltip */}
              <div
                className={`absolute right-14 md:right-16 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-opacity duration-300
                  ${(hoveredItem === item.href || isActive) ? 'opacity-100' : 'opacity-0'}
                  ${isActive ? 'bg-secondary text-secondary-foreground' : 'bg-card text-card-foreground border'}`}
              >
                {item.label}
                <div
                  className={`absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent
                    ${isActive ? 'border-l-4 border-l-secondary' : 'border-l-4 border-l-card'}`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
