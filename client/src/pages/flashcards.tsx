import { useState } from "react";
import { useQuery, useMutation, queryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import FlashcardViewer from "@/components/study/flashcard-viewer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Flashcards() {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showGenerateCards, setShowGenerateCards] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [source, setSource] = useState<"text" | "pdf" | "url">("text");
  const [content, setContent] = useState("");
  const [cardCount, setCardCount] = useState(10);
  const { toast } = useToast();

  const { data: decks = [], isLoading } = useQuery({
    queryKey: ['/api/decks'],
  });

  const { data: selectedDeckData } = useQuery({
    queryKey: ['/api/decks', selectedDeck],
    enabled: !!selectedDeck,
  });

  const createDeckMutation = useMutation({
    mutationFn: async (data: { title: string; source: string; sourceContent?: string }) => {
      return await apiRequest('POST', '/api/decks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decks'] });
      setShowCreateDeck(false);
      setDeckTitle("");
      toast({ title: "Success", description: "Deck created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create deck", variant: "destructive" });
    },
  });

  const generateCardsMutation = useMutation({
    mutationFn: async (data: { content: string; count: number }) => {
      return await apiRequest('POST', `/api/decks/${selectedDeck}/generate`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/decks', selectedDeck] });
      setShowGenerateCards(false);
      setContent("");
      toast({ title: "Success", description: "Flashcards generated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to generate flashcards", variant: "destructive" });
    },
  });

  const handleCreateDeck = () => {
    if (!deckTitle.trim()) return;
    
    createDeckMutation.mutate({
      title: deckTitle,
      source,
      sourceContent: content || undefined,
    });
  };

  const handleGenerateCards = () => {
    if (!content.trim()) return;
    
    generateCardsMutation.mutate({
      content,
      count: cardCount,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedDeck && selectedDeckData) {
    return <FlashcardViewer deck={selectedDeckData} onBack={() => setSelectedDeck(null)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Flashcards</h1>
          <p className="text-muted-foreground">Generate and study smart flashcards with AI</p>
        </div>
        
        <Dialog open={showCreateDeck} onOpenChange={setShowCreateDeck}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-deck">
              <i className="fas fa-plus mr-2"></i>
              Create Deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deck-title">Deck Title</Label>
                <Input
                  id="deck-title"
                  value={deckTitle}
                  onChange={(e) => setDeckTitle(e.target.value)}
                  placeholder="e.g., Physics Chapter 5"
                  data-testid="input-deck-title"
                />
              </div>
              
              <div>
                <Label htmlFor="source-type">Source Type</Label>
                <Select value={source} onValueChange={(value: any) => setSource(value)}>
                  <SelectTrigger data-testid="select-source-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Input</SelectItem>
                    <SelectItem value="pdf">PDF Upload</SelectItem>
                    <SelectItem value="url">Web URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateDeck} 
                  disabled={!deckTitle.trim() || createDeckMutation.isPending}
                  data-testid="button-save-deck"
                >
                  {createDeckMutation.isPending ? "Creating..." : "Create Deck"}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDeck(false)} data-testid="button-cancel-deck">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Deck List */}
      {decks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-brain text-primary text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold mb-2">No Flashcard Decks Yet</h3>
            <p className="text-muted-foreground mb-6">Create your first deck to start studying with AI-generated flashcards</p>
            <Button onClick={() => setShowCreateDeck(true)} data-testid="button-create-first-deck">
              <i className="fas fa-plus mr-2"></i>
              Create Your First Deck
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck: any) => (
            <Card key={deck.id} className="hover-lift cursor-pointer" onClick={() => setSelectedDeck(deck.id)} data-testid={`deck-card-${deck.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">{deck.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{deck.source || 'text'}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {deck.stats?.totalCards || 0} cards
                  </span>
                </div>
                
                {deck.stats?.totalCards === 0 ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDeck(deck.id);
                      setShowGenerateCards(true);
                    }}
                    data-testid={`button-generate-cards-${deck.id}`}
                  >
                    <i className="fas fa-magic mr-2"></i>
                    Generate Cards
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mastery</span>
                      <span>{Math.round((deck.stats?.averageAccuracy || 0) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="progress-bar h-2 rounded-full" 
                        style={{ width: `${(deck.stats?.averageAccuracy || 0) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Generate Cards Modal */}
      <Dialog open={showGenerateCards} onOpenChange={setShowGenerateCards}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Flashcards</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Study Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your notes, textbook content, or any material you want to study..."
                className="min-h-[200px]"
                data-testid="textarea-flashcard-content"
              />
            </div>
            
            <div>
              <Label htmlFor="card-count">Number of Cards</Label>
              <Input
                id="card-count"
                type="number"
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value) || 10)}
                min="1"
                max="50"
                data-testid="input-card-count"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateCards} 
                disabled={!content.trim() || generateCardsMutation.isPending}
                data-testid="button-generate-flashcards"
              >
                {generateCardsMutation.isPending ? "Generating..." : "Generate Flashcards"}
              </Button>
              <Button variant="outline" onClick={() => setShowGenerateCards(false)} data-testid="button-cancel-generate">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
