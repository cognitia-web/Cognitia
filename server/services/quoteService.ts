interface QuoteResponse {
  text: string;
  author: string;
  sourceUrl?: string;
}

class QuoteService {
  private readonly disciplineQuotes = [
    {
      text: "The expert in anything was once a beginner who refused to give up.",
      author: "Helen Hayes",
      sourceUrl: "https://example.com"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      sourceUrl: "https://example.com"
    },
    {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Abraham Lincoln",
      sourceUrl: "https://example.com"
    },
    {
      text: "The pain of discipline weighs ounces while the pain of regret weighs tons.",
      author: "Jim Rohn",
      sourceUrl: "https://example.com"
    },
    {
      text: "Self-discipline is the ability to make yourself do what you should do, when you should do it, whether you feel like it or not.",
      author: "Elbert Hubbard",
      sourceUrl: "https://example.com"
    },
    {
      text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
      author: "Marcus Aurelius",
      sourceUrl: "https://example.com"
    },
    {
      text: "The groundwork for all happiness is good health.",
      author: "Leigh Hunt",
      sourceUrl: "https://example.com"
    },
    {
      text: "Excellence is not a skill, it's an attitude.",
      author: "Ralph Marston",
      sourceUrl: "https://example.com"
    },
    {
      text: "The future belongs to those who prepare for it today.",
      author: "Malcolm X",
      sourceUrl: "https://example.com"
    },
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela",
      sourceUrl: "https://example.com"
    }
  ];

  async fetchDailyQuote(): Promise<QuoteResponse> {
    try {
      // Use a deterministic approach based on the day to ensure same quote per day
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
      const quoteIndex = dayOfYear % this.disciplineQuotes.length;
      
      return this.disciplineQuotes[quoteIndex];
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      // Fallback quote
      return {
        text: "The expert in anything was once a beginner who refused to give up.",
        author: "Helen Hayes",
        sourceUrl: "https://example.com"
      };
    }
  }
}

export const quoteService = new QuoteService();
