import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FlashcardViewerProps {
  deck: any;
  onBack: () => void;
}

export default function FlashcardViewer({ deck, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<"learn" | "review" | "shuffle">("learn");
  const { toast } = useToast();

  const flashcards = deck.flashcards || [];
  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;

  const reviewMutation = useMutation({
    mutationFn: async ({ cardId, quality }: { cardId: string; quality: number }) => {
      return await apiRequest('POST', `/api/flashcards/${cardId}/review`, { quality });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decks', deck.id] });
      nextCard();
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to record review", 
        variant: "destructive" 
      });
    },
  });

  const handleReview = (quality: number) => {
    if (!currentCard) return;
    reviewMutation.mutate({ cardId: currentCard.id, quality });
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // Study session complete
      toast({ 
        title: "Study Complete!", 
        description: `You've reviewed all ${flashcards.length} cards in this deck.` 
      });
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    deck.flashcards = shuffled;
    setCurrentIndex(0);
    setShowAnswer(false);
    setStudyMode("shuffle");
  };

  if (!flashcards.length) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} data-testid="button-back-to-decks">
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Decks
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-muted-foreground text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">No Flashcards Yet</h3>
            <p className="text-muted-foreground mb-6">This deck doesn't have any flashcards. Generate some to start studying!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="flashcard-viewer">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack} data-testid="button-back-to-decks">
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Decks
        </Button>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" data-testid="text-deck-title">{deck.title}</Badge>
          <div className="flex space-x-2">
            <Button
              variant={studyMode === "learn" ? "default" : "outline"}
              size="sm"
              onClick={() => setStudyMode("learn")}
              data-testid="button-mode-learn"
            >
              Learn
            </Button>
            <Button
              variant={studyMode === "review" ? "default" : "outline"}
              size="sm"
              onClick={() => setStudyMode("review")}
              data-testid="button-mode-review"
            >
              Review
            </Button>
            <Button
              variant={studyMode === "shuffle" ? "default" : "outline"}
              size="sm"
              onClick={shuffleCards}
              data-testid="button-mode-shuffle"
            >
              Shuffle
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground" data-testid="text-card-progress">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <Card className="min-h-[400px] hover-lift transition-all duration-200" data-testid="flashcard-current">
          <CardContent className="p-8 flex flex-col justify-center text-center min-h-[400px]">
            <div className="mb-6">
              <Badge 
                variant="secondary" 
                className={`mb-4 ${
                  currentCard?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentCard?.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}
                data-testid="badge-card-difficulty"
              >
                {currentCard?.difficulty || 'medium'}
              </Badge>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-8" data-testid="text-card-question">
                {currentCard?.question}
              </h3>

              {showAnswer ? (
                <div className="space-y-6" data-testid="card-answer-section">
                  <div className="border-t pt-6">
                    <p className="text-lg text-muted-foreground" data-testid="text-card-answer">
                      {currentCard?.answer}
                    </p>
                  </div>

                  {/* Review buttons */}
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReview(1)}
                      disabled={reviewMutation.isPending}
                      data-testid="button-review-again"
                    >
                      Again
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReview(2)}
                      disabled={reviewMutation.isPending}
                      data-testid="button-review-hard"
                    >
                      Hard
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleReview(3)}
                      disabled={reviewMutation.isPending}
                      data-testid="button-review-good"
                    >
                      Good
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(4)}
                      disabled={reviewMutation.isPending}
                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      data-testid="button-review-easy"
                    >
                      Easy
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAnswer(true)}
                  className="mx-auto hover-lift"
                  data-testid="button-reveal-answer"
                >
                  Reveal Answer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={previousCard}
            disabled={currentIndex === 0}
            data-testid="button-previous-card"
          >
            <i className="fas fa-chevron-left mr-2"></i>
            Previous
          </Button>

          <Button
            variant="outline"
            onClick={nextCard}
            disabled={currentIndex === flashcards.length - 1}
            data-testid="button-next-card"
          >
            Next
            <i className="fas fa-chevron-right ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
