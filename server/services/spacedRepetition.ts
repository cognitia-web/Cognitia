class SpacedRepetitionService {
  private readonly defaultIntervals = [1, 3, 7, 14, 30, 60, 120];

  calculateNextReview(lastReview: Date, intervalDays: number, ease: number = 2.5): Date {
    const nextDate = new Date(lastReview);
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate;
  }

  updateCard(quality: number) {
    // Quality: 1=again, 2=hard, 3=good, 4=easy
    const now = new Date();
    let newEase = 2.5;
    let newInterval = 1;

    switch (quality) {
      case 1: // Again
        newEase = Math.max(1.3, newEase - 0.2);
        newInterval = 1;
        break;
      case 2: // Hard
        newEase = Math.max(1.3, newEase - 0.15);
        newInterval = Math.max(1, Math.floor(newInterval * 1.2));
        break;
      case 3: // Good
        newInterval = Math.floor(newInterval * newEase);
        break;
      case 4: // Easy
        newEase = newEase + 0.15;
        newInterval = Math.floor(newInterval * newEase * 1.3);
        break;
    }

    const nextReview = this.calculateNextReview(now, newInterval, newEase);

    return {
      ease: newEase,
      intervalDays: newInterval,
      nextReview: nextReview.toISOString().split('T')[0],
      reviewCount: sql`review_count + 1`,
      correctCount: quality >= 3 ? sql`correct_count + 1` : sql`correct_count`,
    };
  }

  updateTopic(quality: number, timeSpent: number) {
    const now = new Date();
    const reviewEntry = {
      date: now.toISOString().split('T')[0],
      quality,
      timeSpent,
    };

    let newEase = 2.5;
    let newInterval = 1;

    switch (quality) {
      case 1: // Again
        newEase = Math.max(1.3, newEase - 0.2);
        newInterval = 1;
        break;
      case 2: // Hard
        newEase = Math.max(1.3, newEase - 0.15);
        newInterval = Math.max(1, Math.floor(newInterval * 1.2));
        break;
      case 3: // Good
        newInterval = Math.floor(newInterval * newEase);
        break;
      case 4: // Easy
        newEase = newEase + 0.15;
        newInterval = Math.floor(newInterval * newEase * 1.3);
        break;
    }

    const nextDate = this.calculateNextReview(now, newInterval, newEase);

    return {
      ease: newEase,
      intervalDays: newInterval,
      nextDate: nextDate.toISOString().split('T')[0],
      reviewHistory: sql`review_history || ${JSON.stringify([reviewEntry])}::jsonb`,
    };
  }
}

export const spacedRepetitionService = new SpacedRepetitionService();
