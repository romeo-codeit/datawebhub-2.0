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
    <nav className="floating-nav">
      <div className="flex flex-col space-y-4">
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
                  className={`flex items-center justify-center w-12 h-12 rounded-full glass-effect transition-all duration-300 group ${
                    isActive 
                      ? 'bg-warmOrange/30 border-warmOrange' 
                      : 'hover:bg-white/30'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive 
                        ? 'text-warmOrange' 
                        : 'text-softNavy group-hover:text-warmOrange'
                    }`} 
                  />
                </button>
              </Link>
              
              {/* Underline */}
              {hoveredItem === item.href && (
                <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-softNavy text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 animate-fade-in">
                  {item.label}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-softNavy border-y-4 border-y-transparent"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
