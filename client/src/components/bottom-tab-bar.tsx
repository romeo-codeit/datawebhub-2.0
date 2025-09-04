import { Link, useLocation } from "wouter";
import { Home, User, Briefcase, Bot } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/about", icon: User, label: "About" },
  { href: "/projects", icon: Briefcase, label: "Projects" },
  { href: "/chat", icon: Bot, label: "Chat" },
];

export default function BottomTabBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t p-1 md:hidden z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-20 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
