import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { name: "Home", href: "/", icon: "fas fa-home" },
  { name: "Flashcards", href: "/flashcards", icon: "fas fa-brain" },
  { name: "Q&A", href: "/qa", icon: "fas fa-comments" },
  { name: "Planner", href: "/planner", icon: "fas fa-calendar" },
  { name: "Rewards", href: "/rewards", icon: "fas fa-trophy" },
  { name: "Settings", href: "/settings", icon: "fas fa-cog" },
];

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2" data-testid="nav-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-graduation-cap text-primary-foreground text-sm"></i>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StudyHub
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLocation(item.href)}
                  className="hover-lift"
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  <i className={`${item.icon} mr-2 text-sm`}></i>
                  {item.name}
                </Button>
              );
            })}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* User Level and Points */}
            <div className="hidden sm:flex items-center space-x-2">
              <Badge variant="outline" data-testid="nav-user-level">
                {user?.level || 'Bronze'}
              </Badge>
              <span className="text-sm text-muted-foreground" data-testid="nav-user-points">
                {(user?.points || 0).toLocaleString()} pts
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-primary text-sm"></i>
                )}
              </div>
              {user?.firstName && (
                <span className="hidden sm:inline text-sm font-medium" data-testid="nav-user-name">
                  {user.firstName}
                </span>
              )}
            </div>

            {/* Streak Indicator */}
            {user?.streak && user.streak > 0 && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 rounded-full">
                <i className="fas fa-fire text-orange-600 text-sm"></i>
                <span className="text-sm font-medium text-orange-800" data-testid="nav-streak">
                  {user.streak}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="px-4 py-2">
          <div className="flex justify-between items-center">
            {navigationItems.slice(0, 5).map((item) => {
              const isActive = location === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setLocation(item.href)}
                  className="flex-col h-auto py-2 px-1"
                  data-testid={`nav-mobile-${item.name.toLowerCase()}`}
                >
                  <i className={`${item.icon} text-sm mb-1`}></i>
                  <span className="text-xs">{item.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
