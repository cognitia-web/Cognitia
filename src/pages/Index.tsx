import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingSidebar } from '@/components/FloatingSidebar';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { GoalCard } from '@/components/GoalCard';
import { Footer } from '@/components/Footer';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ScrollProgress } from '@/components/ScrollProgress';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const goals = [
  {
    title: 'Launch Marketing Campaign',
    description: 'Q1 2025 product launch with multi-channel strategy',
    progress: 75,
    category: 'Business',
    details: 'Comprehensive marketing campaign including social media, email outreach, and content marketing. Target audience segmentation completed, creative assets in final review.',
  },
  {
    title: 'Master TypeScript',
    description: 'Complete advanced TypeScript certification course',
    progress: 60,
    category: 'Learning',
    details: 'Working through advanced type systems, generics, and decorators. Building real-world projects to reinforce concepts. Currently on module 8 of 12.',
  },
  {
    title: 'Fitness Challenge',
    description: 'Complete 90-day transformation program',
    progress: 45,
    category: 'Health',
    details: 'Following structured workout plan with nutrition tracking. Lost 8 lbs so far. Strength training 4x per week, cardio 3x per week. Feeling great!',
  },
  {
    title: 'Build SaaS Product',
    description: 'MVP launch for productivity tool',
    progress: 82,
    category: 'Business',
    details: 'Core features implemented. Currently in beta testing with 50 users. Collecting feedback and iterating on UI/UX. Payment integration next milestone.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen w-full relative scroll-smooth">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to Content
      </a>

      <ScrollProgress />
      <ParticleBackground />
      <FloatingSidebar />
      <ThemeToggleButton />
      <FloatingActionButton />

      <main 
        id="main-content" 
        className="md:ml-[72px] transition-all duration-300"
      >
        <HeroSlideshow />

        {/* Goals Section */}
        <section id="goals" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 animate-fade-up">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20 animate-pulse-border">
              Active Goals
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Journey to Success
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Track your progress and achieve greatness, one goal at a time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
              >
                <GoalCard {...goal} />
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="max-w-7xl mx-auto px-6 py-24">
          <div className="relative glass-strong rounded-3xl p-10 md:p-16 overflow-hidden animate-fade-in">
            {/* Background gradient orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
            
            <div className="relative z-10">
              <div className="text-center mb-12 animate-fade-up">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Insights & Analytics
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Beautiful visualizations and intelligent insights to keep you motivated
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-8 glass rounded-2xl hover-lift hover-scale hover-tilt group animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                    <AnimatedCounter value={12} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Goals Completed
                  </div>
                </div>
                
                <div className="text-center p-8 glass rounded-2xl hover-lift hover-scale hover-tilt group animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                    <AnimatedCounter value={4} />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Active Goals
                  </div>
                </div>
                
                <div className="text-center p-8 glass rounded-2xl hover-lift hover-scale hover-tilt group animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
                    <AnimatedCounter value={89} suffix="%" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Index;
