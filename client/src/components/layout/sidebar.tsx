import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Home", href: "/", icon: "fas fa-home" },
  { name: "Flashcards", href: "/flashcards", icon: "fas fa-brain" },
  { name: "Q&A", href: "/qa", icon: "fas fa-comments" },
  { name: "Planner", href: "/planner", icon: "fas fa-calendar" },
  { name: "Rewards", href: "/rewards", icon: "fas fa-trophy" },
  { name: "Settings", href: "/settings", icon: "fas fa-cog" },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-card border-r border-border transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-primary-foreground text-sm"></i>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  StudyHub
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              data-testid="button-toggle-sidebar"
            >
              <i className={`fas fa-${collapsed ? 'expand' : 'compress'}-alt`}></i>
            </Button>
          </div>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-primary"></i>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" data-testid="text-user-name-sidebar">
                  {user?.firstName || 'Student'}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs" data-testid="badge-user-level">
                    {user?.level || 'Bronze'}
                  </Badge>
                  <span className="text-xs text-muted-foreground" data-testid="text-user-points">
                    {user?.points || 0} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.name}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start hover-lift",
                      collapsed && "px-2"
                    )}
                    onClick={() => setLocation(item.href)}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                  >
                    <i className={`${item.icon} ${collapsed ? '' : 'mr-3'} text-sm`}></i>
                    {!collapsed && item.name}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Streak Display */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-fire text-orange-600"></i>
              </div>
              <div>
                <p className="text-sm font-medium" data-testid="text-streak-sidebar">
                  {user?.streak || 0}-day streak!
                </p>
                <p className="text-xs text-muted-foreground">Keep it going 🚀</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
