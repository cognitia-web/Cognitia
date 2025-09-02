import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DailyQuote from "@/components/common/daily-quote";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-primary-foreground text-sm"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StudyHub
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#rewards" className="text-muted-foreground hover:text-foreground transition-colors">Rewards</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/api/login'} data-testid="button-sign-in">
                Sign In
              </Button>
              <Button onClick={() => window.location.href = '/api/login'} className="hover-lift" data-testid="button-get-started">
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8 animate-fadeIn">
              <i className="fas fa-star mr-2"></i>
              Free forever • AI-powered • Global access
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Your Learning<br/>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Journey Daily
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              A free, global study platform that helps students learn faster with AI flashcards, 
              spaced repetition, and gamified progress tracking. Build your streak from Bronze to Energon.
            </p>

            <DailyQuote />

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'} 
                className="hover-lift glow-effect"
                data-testid="button-start-learning"
              >
                <i className="fas fa-rocket mr-2"></i>
                Start Learning Today
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-lift"
                data-testid="button-watch-demo"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comprehensive Study Toolkit</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to study smarter, retain more, and build lasting learning habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Flashcards */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-brain text-primary text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">AI Flashcard Generator</h3>
                <p className="text-muted-foreground mb-6">
                  Upload text, PDFs, or notes. AI automatically generates smart flashcards with multiple study modes.
                </p>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Flashcard 1 of 24</span>
                    <div className="flex space-x-1">
                      <Badge variant="default" className="text-xs">Learn</Badge>
                      <Badge variant="secondary" className="text-xs">Review</Badge>
                    </div>
                  </div>
                  <div className="text-center py-6">
                    <p className="font-medium mb-4">What is Newton's First Law?</p>
                    <Button variant="link" size="sm">Reveal Answer</Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="destructive" size="sm" className="hover-lift">Again</Button>
                  <Button variant="secondary" size="sm" className="hover-lift">Hard</Button>
                  <Button variant="default" size="sm" className="hover-lift">Good</Button>
                  <Button variant="outline" size="sm" className="hover-lift bg-green-50 text-green-700 border-green-200">Easy</Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Q&A */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-comments text-accent text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Smart Q&A Assistant</h3>
                <p className="text-muted-foreground mb-6">
                  Ask any question. Choose your AI model and response style from concise to exam-ready long answers.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <select className="text-sm border border-border rounded px-2 py-1">
                        <option>GPT-4</option>
                        <option>Claude-3</option>
                        <option>Gemini</option>
                      </select>
                      <select className="text-sm border border-border rounded px-2 py-1">
                        <option>Exam-Style</option>
                        <option>Concise</option>
                        <option>ELI15</option>
                      </select>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Explain photosynthesis in detail..." 
                      className="w-full px-3 py-2 border border-border rounded text-sm"
                    />
                  </div>
                  
                  <Button className="w-full hover-lift">
                    <i className="fas fa-magic mr-2"></i>
                    Generate Answer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Scheduling */}
            <Card className="hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-calendar-alt text-secondary text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-4">Intelligent Scheduling</h3>
                <p className="text-muted-foreground mb-6">
                  Auto-generate study timetables based on task intensity and available time. Drag to reschedule.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/5 border-l-4 border-primary rounded">
                    <div>
                      <p className="font-medium text-sm">Physics Ch.5</p>
                      <p className="text-xs text-muted-foreground">9:00 - 10:30 AM</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary">High</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-secondary/5 border-l-4 border-secondary rounded">
                    <div>
                      <p className="font-medium text-sm">Math Review</p>
                      <p className="text-xs text-muted-foreground">2:00 - 2:45 PM</p>
                    </div>
                    <Badge className="bg-secondary/20 text-secondary">Med</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 border-l-4 border-muted-foreground/30 rounded">
                    <div>
                      <p className="font-medium text-sm">Chemistry Notes</p>
                      <p className="text-xs text-muted-foreground">4:00 - 4:30 PM</p>
                    </div>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section id="rewards" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Level Up Your Learning</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Climb the rewards ladder from Bronze to Energon. Each level unlocks new badges, themes, and bragging rights.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              <Card className="bg-orange-100 border-2 border-orange-300 hover-lift">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-orange-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-medal text-orange-600"></i>
                  </div>
                  <h4 className="font-bold text-orange-800">Bronze</h4>
                  <p className="text-xs text-orange-600">100 pts</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-100 border-2 border-gray-300 hover-lift">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-award text-gray-600"></i>
                  </div>
                  <h4 className="font-bold text-gray-800">Silver</h4>
                  <p className="text-xs text-gray-600">250 pts</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-100 border-2 border-yellow-400 hover-lift glow-effect">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-yellow-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-crown text-yellow-600"></i>
                  </div>
                  <h4 className="font-bold text-yellow-800">Gold</h4>
                  <p className="text-xs text-yellow-600">500 pts</p>
                  <div className="text-xs text-green-600 font-medium mt-1">Example</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-100 border-2 border-purple-300 hover-lift opacity-60">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-gem text-purple-600"></i>
                  </div>
                  <h4 className="font-bold text-purple-800">Platinum</h4>
                  <p className="text-xs text-purple-600">1,500 pts</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-100 border-2 border-blue-300 hover-lift opacity-60">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <i className="fas fa-diamond text-blue-600"></i>
                  </div>
                  <h4 className="font-bold text-blue-800">Diamond</h4>
                  <p className="text-xs text-blue-600">2,500 pts</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg border border-border">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Example Progress</h3>
                    <p className="text-muted-foreground">See how the rewards system works!</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">725</div>
                    <div className="text-sm text-muted-foreground">total points</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Platinum</span>
                    <span>725/1,500 pts (48%)</span>
                  </div>
                  <Progress value={48} className="h-3" />
                  <div className="text-sm text-muted-foreground text-center">
                    775 points until next level
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-accent to-secondary">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Join thousands of students already using StudyHub to build better study habits, 
            master their subjects, and achieve academic excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              onClick={() => window.location.href = '/api/login'}
              className="hover-lift shadow-lg"
              data-testid="button-get-started-cta"
            >
              <i className="fas fa-rocket mr-2"></i>
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary hover-lift"
              data-testid="button-watch-demo-cta"
            >
              <i className="fas fa-play mr-2"></i>
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
