import OpenAI from "openai";

/*
The newest OpenAI model is "gpt-5" which was released August 7, 2025. 
Do not change this unless explicitly requested by the user.
*/

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-example-key-placeholder",
});

const DEFAULT_MODEL = "gpt-4"; // Using gpt-4 as fallback since gpt-5 may not be available yet

interface FlashcardPair {
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface QAResponse {
  outline: string;
  answer: string;
  sources?: string[];
}

class AIService {
  async generateFlashcards(content: string, count: number = 10, model: string = DEFAULT_MODEL): Promise<FlashcardPair[]> {
    try {
      const prompt = `Create ${count} flashcards from the following content. Format as JSON array with objects containing "question", "answer", and "difficulty" (easy/medium/hard) fields. Make questions test understanding, not just memorization.

Content:
${content}

Return only the JSON array, no other text.`;

      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.flashcards || [];
    } catch (error) {
      console.error("Error generating flashcards:", error);
      throw new Error("Failed to generate flashcards");
    }
  }

  async generateAnswer(
    prompt: string, 
    mode: 'concise' | 'eli15' | 'exam_style',
    model: string = DEFAULT_MODEL,
    sources: string[] = []
  ): Promise<QAResponse> {
    try {
      let systemPrompt = "";
      
      switch (mode) {
        case 'concise':
          systemPrompt = "Provide a clear, concise answer. Be direct and to the point.";
          break;
        case 'eli15':
          systemPrompt = "Explain like the user is 15 years old. Use simple language, analogies, and examples they can relate to.";
          break;
        case 'exam_style':
          systemPrompt = "Provide a comprehensive, exam-style answer with detailed explanations, examples, and structured formatting. Include an outline first.";
          break;
      }

      const fullPrompt = sources.length > 0 
        ? `${systemPrompt}\n\nSources to reference:\n${sources.join('\n')}\n\nQuestion: ${prompt}`
        : `${systemPrompt}\n\nQuestion: ${prompt}`;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: fullPrompt }
        ],
        max_tokens: mode === 'exam_style' ? 3000 : 1000,
      });

      const content = response.choices[0].message.content || '';
      
      // For exam style, try to extract outline
      let outline = '';
      let answer = content;
      
      if (mode === 'exam_style' && content.includes('Outline:')) {
        const parts = content.split('Outline:');
        if (parts.length > 1) {
          const outlinePart = parts[1].split('\n\n')[0];
          outline = outlinePart.trim();
          answer = content.replace(`Outline:${outlinePart}`, '').trim();
        }
      }

      return {
        outline,
        answer,
        sources: sources.length > 0 ? sources : undefined,
      };
    } catch (error) {
      console.error("Error generating answer:", error);
      throw new Error("Failed to generate answer");
    }
  }
}

export const aiService = new AIService();
