import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function DailyQuote() {
  const { data: quote, isLoading } = useQuery({
    queryKey: ['/api/quote/daily'],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto mb-12 hover-lift animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <Card className="max-w-2xl mx-auto mb-12 hover-lift shadow-lg border border-border" data-testid="card-daily-quote">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-quote-left text-secondary"></i>
          </div>
          <div className="text-left">
            <p className="text-lg font-medium mb-2" data-testid="text-quote-content">
              "{quote.text}"
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-quote-author">
              — {quote.author} • Daily Discipline Quote
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
