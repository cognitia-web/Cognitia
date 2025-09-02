import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { AI_MODELS, QA_MODES } from "@/lib/constants";
import type { QaHistory } from "@shared/schema";

interface QAResponse {
  id: string;
  outline?: string;
  answer: string;
  sources?: string[];
  model: string;
  mode: string;
}

export default function QAInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(user?.modelDefaults?.qa || "gpt-4");
  const [selectedMode, setSelectedMode] = useState("exam_style");
  const [currentResponse, setCurrentResponse] = useState<QAResponse | null>(null);

  const { data: qaHistory = [] } = useQuery<QaHistory[]>({
    queryKey: ['/api/qa/history'],
  });

  const askMutation = useMutation({
    mutationFn: async (data: { prompt: string; mode: string; model: string }) => {
      return await apiRequest('POST', '/api/qa/ask', data);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setCurrentResponse(data);
      setPrompt("");
      toast({ 
        title: "Answer Generated", 
        description: "Your question has been answered successfully!" 
      });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to generate answer. Please try again.", 
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    askMutation.mutate({
      prompt: prompt.trim(),
      mode: selectedMode,
      model: selectedModel,
    });
  };

  const selectedModeConfig = QA_MODES.find(mode => mode.value === selectedMode);

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-question-circle mr-2 text-accent"></i>
            Ask Your Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model and Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">AI Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger data-testid="select-qa-model">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.qa.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Response Style</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger data-testid="select-qa-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QA_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      <div>
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-xs text-muted-foreground">{mode.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedModeConfig && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{selectedModeConfig.label}:</strong> {selectedModeConfig.description}
              </p>
            </div>
          )}

          {/* Question Input */}
          <div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask any question about your studies... e.g., 'Explain the process of photosynthesis in detail'"
              className="min-h-[120px] resize-none"
              data-testid="textarea-qa-prompt"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || askMutation.isPending}
            className="w-full hover-lift"
            data-testid="button-submit-question"
          >
            {askMutation.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating Answer...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Answer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Response */}
      {currentResponse && (
        <Card className="border-2 border-primary/20" data-testid="card-current-response">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <i className="fas fa-lightbulb mr-2 text-primary"></i>
                AI Answer
              </CardTitle>
              <div className="flex space-x-2">
                <Badge variant="outline">{currentResponse.model}</Badge>
                <Badge variant="secondary">{selectedModeConfig?.label}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentResponse.outline && (
              <div data-testid="response-outline">
                <h4 className="font-semibold mb-2">Outline:</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{currentResponse.outline}</pre>
                </div>
              </div>
            )}

            <div data-testid="response-answer">
              <h4 className="font-semibold mb-2">Answer:</h4>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">{currentResponse.answer}</p>
              </div>
            </div>

            {currentResponse.sources && currentResponse.sources.length > 0 && (
              <div data-testid="response-sources">
                <h4 className="font-semibold mb-2">Sources:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {currentResponse.sources.map((source, index) => (
                    <li key={index} className="text-sm text-muted-foreground">{source}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-2 pt-4">
              <Button variant="outline" size="sm" data-testid="button-copy-answer">
                <i className="fas fa-copy mr-2"></i>
                Copy
              </Button>
              <Button variant="outline" size="sm" data-testid="button-save-answer">
                <i className="fas fa-bookmark mr-2"></i>
                Save
              </Button>
              <Button variant="outline" size="sm" data-testid="button-export-answer">
                <i className="fas fa-download mr-2"></i>
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Q&A History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-history mr-2 text-muted-foreground"></i>
            Recent Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {qaHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions asked yet. Start by asking your first question above!</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="list-qa-history">
              {qaHistory.slice(0, 5).map((item: any) => (
                <div key={item.id} className="border rounded-lg p-4 hover-lift cursor-pointer" data-testid={`qa-history-${item.id}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm line-clamp-2">{item.prompt}</p>
                    <div className="flex space-x-1 ml-4">
                      <Badge variant="outline" className="text-xs">{item.model}</Badge>
                      <Badge variant="secondary" className="text-xs">{item.mode}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
