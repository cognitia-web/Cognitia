import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination, Keyboard } from 'swiper/modules';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Master Your Goals with Intelligence',
    subtitle: 'Transform ambitions into achievements with AI-powered insights',
    cta: 'Get Started',
    titleDirection: 'left',
    subtitleDirection: 'right',
  },
  {
    title: 'Track Progress in Real-Time',
    subtitle: 'Visualize your journey with beautiful analytics and metrics',
    cta: 'Explore Features',
    titleDirection: 'right',
    subtitleDirection: 'left',
  },
  {
    title: 'Achieve More, Stress Less',
    subtitle: 'Smart reminders and intelligent planning keep you on track',
    cta: 'Start Free Trial',
    titleDirection: 'up',
    subtitleDirection: 'down',
  },
];

const PremiumCTA = ({ text, index }: { text: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const magnetX = useSpring(useMotionValue(0), springConfig);
  const magnetY = useSpring(useMotionValue(0), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    const maxDistance = 120;
    if (distance < maxDistance) {
      const strength = 1 - distance / maxDistance;
      magnetX.set(distanceX * strength * 0.3);
      magnetY.set(distanceY * strength * 0.3);
    } else {
      magnetX.set(0);
      magnetY.set(0);
    }
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    magnetX.set(0);
    magnetY.set(0);
  };

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      style={prefersReducedMotion ? {} : { x: magnetX, y: magnetY }}
      animate={prefersReducedMotion ? {} : {
        y: [0, -5, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <Button
        ref={buttonRef}
        data-testid={`button-cta-slide-${index}`}
        size="lg"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        className="group relative overflow-hidden text-lg px-10 py-7 h-auto font-bold tracking-wide"
        style={{
          background: isPressed 
            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)'
            : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)',
          boxShadow: isHovered 
            ? '0 0 40px hsl(var(--primary) / 0.6), 0 0 80px hsl(var(--accent) / 0.4), 0 10px 30px rgba(0,0,0,0.3)'
            : '0 0 20px hsl(var(--primary) / 0.3), 0 5px 15px rgba(0,0,0,0.2)',
          transform: isPressed ? 'scale(0.96)' : isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            left: useTransform(mouseX, [0, 100], ['-100%', '100%']),
          }}
          animate={isHovered ? {
            x: ['0%', '200%'],
          } : {}}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />
        
        <span className="relative z-10 flex items-center gap-2">
          {text}
          <motion.div
            animate={isHovered ? {
              x: [0, 5, 0],
            } : {}}
            transition={{
              duration: 0.6,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </span>
        
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-md"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              left: `${mouseX.get()}%`,
              top: `${mouseY.get()}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export const HeroSlideshow = () => {
  const swiperRef = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!swiperRef.current) return;
      
      if (e.key === 'ArrowLeft') {
        swiperRef.current.swiper.slidePrev();
      } else if (e.key === 'ArrowRight') {
        swiperRef.current.swiper.slideNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (swiperRef.current.swiper.autoplay.running) {
          swiperRef.current.swiper.autoplay.stop();
        } else {
          swiperRef.current.swiper.autoplay.start();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getSlideDirection = (direction: string) => {
    if (prefersReducedMotion) return { opacity: 0 };
    
    switch (direction) {
      case 'left':
        return { x: -100, opacity: 0 };
      case 'right':
        return { x: 100, opacity: 0 };
      case 'up':
        return { y: -50, opacity: 0 };
      case 'down':
        return { y: 50, opacity: 0 };
      default:
        return { opacity: 0 };
    }
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden" id="home" data-testid="hero-section">
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent pointer-events-none"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Pagination, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1200}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-primary/30',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
        }}
        keyboard={{ enabled: true }}
        className="w-full h-full"
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex);
          setIsVisible(false);
          setTimeout(() => setIsVisible(true), 100);
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center justify-center gradient-mesh">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(153,118,244,0.15),transparent_60%)]" />
              
              <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
                animate={prefersReducedMotion ? {} : {
                  y: [0, -30, 0],
                  x: [0, 20, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
                animate={prefersReducedMotion ? {} : {
                  y: [0, 30, 0],
                  x: [0, -20, 0],
                  scale: [1, 1.15, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
              
              <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <AnimatePresence mode="wait">
                  {isVisible && currentSlide === index && (
                    <>
                      <motion.div
                        key={`title-${index}`}
                        initial={getSlideDirection(slide.titleDirection)}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: prefersReducedMotion ? 0.3 : 0.8, 
                          ease: "easeOut",
                          delay: prefersReducedMotion ? 0 : 0.1,
                        }}
                      >
                        <h1 
                          className="text-5xl md:text-6xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-[1.1] tracking-tight"
                          style={{
                            textShadow: '0 0 40px hsl(var(--primary) / 0.3), 0 0 80px hsl(var(--accent) / 0.2)',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                          }}
                          data-testid={`text-hero-title-${index}`}
                        >
                          {slide.title}
                        </h1>
                      </motion.div>
                      
                      <motion.div
                        key={`subtitle-${index}`}
                        initial={getSlideDirection(slide.subtitleDirection)}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: prefersReducedMotion ? 0.3 : 0.8, 
                          ease: "easeOut",
                          delay: prefersReducedMotion ? 0.1 : 0.3,
                        }}
                      >
                        <h2 
                          className="text-xl md:text-2xl lg:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                          style={{
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                            letterSpacing: '0.01em',
                          }}
                          data-testid={`text-hero-subtitle-${index}`}
                        >
                          {slide.subtitle}
                        </h2>
                      </motion.div>
                      
                      <motion.div
                        key={`cta-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ 
                          duration: prefersReducedMotion ? 0.3 : 0.6, 
                          ease: "easeOut",
                          delay: prefersReducedMotion ? 0.2 : 0.5,
                        }}
                      >
                        <PremiumCTA text={slide.cta} index={index} />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        animate={prefersReducedMotion ? {} : {
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={() => {
          const nextSection = document.querySelector('#home')?.nextElementSibling;
          nextSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        data-testid="button-scroll-indicator"
      >
        <span className="text-sm text-muted-foreground font-medium tracking-wide">Scroll to explore</span>
        <motion.div
          animate={prefersReducedMotion ? {} : {
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-6 h-6 text-primary drop-shadow-glow" />
        </motion.div>
      </motion.div>
      
      <style>{`
        .swiper-pagination {
          bottom: 60px !important;
          z-index: 30;
        }
        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          margin: 0 10px !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.6;
          border: 2px solid hsl(var(--primary) / 0.3);
        }
        .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 8px;
          opacity: 1;
          box-shadow: 0 0 20px hsl(var(--primary) / 0.8), 0 0 40px hsl(var(--accent) / 0.4);
          border: 2px solid hsl(var(--primary));
        }
        .swiper-pagination-bullet:hover {
          opacity: 1;
          transform: scale(1.2);
          box-shadow: 0 0 15px hsl(var(--primary) / 0.6);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .swiper-pagination-bullet,
          .swiper-pagination-bullet-active {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};
