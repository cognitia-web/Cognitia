import { useState, useRef, useEffect } from 'react';
import { Home, Target, BarChart3, Settings, Menu, X } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  icon: typeof Home;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', icon: Home, href: '#home' },
  { name: 'Goals', icon: Target, href: '#goals' },
  { name: 'Analytics', icon: BarChart3, href: '#analytics' },
  { name: 'Settings', icon: Settings, href: '#settings' },
];

export const FloatingSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeIndex = navItems.findIndex(item => item.name === activeItem);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const sidebarVariants = {
    collapsed: {
      width: 72,
      transition: prefersReducedMotion ? { duration: 0 } : {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    },
    expanded: {
      width: 256,
      transition: prefersReducedMotion ? { duration: 0 } : {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: prefersReducedMotion ? { duration: 0 } : {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: prefersReducedMotion ? { duration: 0 } : {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 rounded-xl glass hover:glass-strong transition-all"
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        aria-label="Toggle menu"
        data-testid="button-mobile-menu-toggle"
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Desktop Sidebar */}
      <TooltipProvider delayDuration={200}>
        <motion.nav
          className="hidden md:flex fixed left-0 top-0 h-screen z-40 flex-col py-6 overflow-hidden"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(40px) saturate(200%)',
            border: '1px solid var(--glass-border)',
            boxShadow: `
              0 8px 32px hsl(var(--background) / 0.4),
              0 0 0 1px hsl(var(--primary) / 0.1),
              inset 0 1px 0 0 hsl(0 0% 100% / 0.05)
            `,
          }}
          variants={sidebarVariants}
          initial="collapsed"
          animate={isExpanded ? "expanded" : "collapsed"}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          data-testid="nav-desktop-sidebar"
        >
          {/* Gradient border glow */}
          <motion.div
            className="absolute inset-0 rounded-r-2xl opacity-60 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))',
              filter: 'blur(1px)',
            }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Logo Section */}
          <motion.div 
            className="px-4 mb-6 relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: 0.1
            }}
          >
            <motion.div
              className="relative"
              animate={prefersReducedMotion ? {} : {
                filter: [
                  'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))',
                  'drop-shadow(0 0 16px hsl(var(--primary) / 0.5))',
                  'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))',
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                  >
                    <Logo size="sm" showText={true} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={prefersReducedMotion ? { duration: 0 } : {
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                  >
                    <Logo size="sm" showText={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Divider with gradient */}
            <motion.div
              className="mt-6 h-px relative overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.3, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                animate={prefersReducedMotion ? {} : {
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Nav Items */}
          <motion.div 
            className="flex-1 flex flex-col gap-2 px-3 relative"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Active indicator line */}
            <motion.div
              className="absolute left-0 w-1 h-12 rounded-r-full bg-gradient-to-b from-primary to-accent"
              initial={false}
              animate={{
                y: activeIndex * 56 + 8,
                opacity: 1,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              style={{
                boxShadow: '0 0 20px hsl(var(--primary) / 0.6)'
              }}
            />

            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              const isHovered = hoveredItem === item.name;
              
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <motion.a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item.name);
                        handleRipple(e);
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 group relative overflow-hidden",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive 
                          ? "text-primary" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                      variants={itemVariants}
                      whileHover={prefersReducedMotion ? {} : { 
                        x: 4,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                      data-testid={`nav-item-${item.name.toLowerCase()}`}
                      aria-label={item.name}
                      aria-current={isActive ? 'page' : undefined}
                      tabIndex={0}
                    >
                      {/* Background glow for active */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl"
                          animate={prefersReducedMotion ? {} : {
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          layoutId="activeBackground"
                        />
                      )}

                      {/* Ripple effects */}
                      <AnimatePresence>
                        {ripples.map(ripple => (
                          <motion.span
                            key={ripple.id}
                            className="absolute rounded-full bg-primary/30"
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                            }}
                            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
                            animate={{ 
                              width: 100, 
                              height: 100,
                              opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        ))}
                      </AnimatePresence>

                      {/* Icon with magnetic effect and breathing animation */}
                      <motion.div
                        className="relative z-10"
                        animate={prefersReducedMotion ? {} : (isActive ? {
                          scale: [1, 1.05, 1],
                        } : {})}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        whileHover={prefersReducedMotion ? {} : {
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { 
                            rotate: { duration: 0.5, ease: "easeInOut" },
                            scale: { type: "spring", stiffness: 400, damping: 15 }
                          }
                        }}
                      >
                        <Icon 
                          className={cn(
                            "w-6 h-6 flex-shrink-0 transition-all duration-300",
                            isActive && "drop-shadow-glow"
                          )}
                          style={isActive ? {
                            filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.8))',
                          } : {}}
                        />
                        
                        {/* Icon glow on hover */}
                        {(isHovered || isActive) && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                              opacity: isActive ? [0.4, 0.6, 0.4] : 0.3, 
                              scale: 1.5,
                            }}
                            transition={prefersReducedMotion ? { duration: 0 } : {
                              opacity: { duration: 2, repeat: Infinity },
                              scale: { type: "spring", stiffness: 200, damping: 15 }
                            }}
                            style={{
                              background: 'radial-gradient(circle, hsl(var(--primary) / 0.4), transparent 70%)',
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Text label */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            className={cn(
                              "font-medium whitespace-nowrap relative z-10",
                              isActive && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                            )}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={prefersReducedMotion ? { duration: 0 } : {
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              delay: 0.05
                            }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.a>
                  </TooltipTrigger>
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <TooltipContent 
                      side="right" 
                      className="glass-strong"
                      sideOffset={12}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -5 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                      >
                        {item.name}
                      </motion.div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </motion.div>
        </motion.nav>
      </TooltipProvider>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.nav
              className="md:hidden fixed inset-y-0 left-0 z-40 w-64 overflow-hidden"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(40px) saturate(200%)',
                border: '1px solid var(--glass-border)',
                boxShadow: `
                  0 8px 32px hsl(var(--background) / 0.4),
                  0 0 0 1px hsl(var(--primary) / 0.1),
                  inset 0 1px 0 0 hsl(0 0% 100% / 0.05)
                `,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={prefersReducedMotion ? { duration: 0 } : {
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              data-testid="nav-mobile-sidebar"
            >
              {/* Gradient border glow */}
              <motion.div
                className="absolute inset-0 rounded-r-2xl opacity-60 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.15))',
                  filter: 'blur(1px)',
                }}
                animate={prefersReducedMotion ? {} : {
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="p-6 mb-4 relative">
                <Logo size="sm" showText={true} />
                
                {/* Divider */}
                <motion.div
                  className="mt-6 h-px relative overflow-hidden"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.2, duration: 0.5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </motion.div>
              </div>
              
              <motion.div 
                className="flex flex-col gap-2 px-6 relative"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {/* Active indicator */}
                <motion.div
                  className="absolute left-0 w-1 h-12 rounded-r-full bg-gradient-to-b from-primary to-accent"
                  initial={false}
                  animate={{
                    y: activeIndex * 56 + 8,
                  }}
                  transition={prefersReducedMotion ? { duration: 0 } : {
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  style={{
                    boxShadow: '0 0 20px hsl(var(--primary) / 0.6)'
                  }}
                />

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.name;
                  
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item.name);
                        setIsMobileOpen(false);
                        handleRipple(e);
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 relative overflow-hidden",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive 
                          ? "text-primary" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                      variants={itemVariants}
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                      data-testid={`nav-item-mobile-${item.name.toLowerCase()}`}
                      aria-label={item.name}
                      aria-current={isActive ? 'page' : undefined}
                      tabIndex={0}
                    >
                      {/* Background glow for active */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl"
                          animate={prefersReducedMotion ? {} : {
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}

                      {/* Ripple effects */}
                      <AnimatePresence>
                        {ripples.map(ripple => (
                          <motion.span
                            key={ripple.id}
                            className="absolute rounded-full bg-primary/30"
                            style={{
                              left: ripple.x,
                              top: ripple.y,
                            }}
                            initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
                            animate={{ 
                              width: 100, 
                              height: 100,
                              opacity: 0,
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        ))}
                      </AnimatePresence>

                      <motion.div
                        animate={prefersReducedMotion ? {} : (isActive ? {
                          scale: [1, 1.05, 1],
                        } : {})}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon 
                          className={cn(
                            "w-6 h-6 relative z-10",
                            isActive && "drop-shadow-glow"
                          )} 
                        />
                      </motion.div>
                      
                      <span 
                        className={cn(
                          "font-medium relative z-10",
                          isActive && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                        )}
                      >
                        {item.name}
                      </span>
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.nav>

            {/* Mobile Overlay */}
            <motion.div
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
              onClick={() => setIsMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
              data-testid="overlay-mobile-backdrop"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
