// Deprecated: This hook is being replaced by useFirebaseAuth
// Keeping for backward compatibility during migration
import { useFirebaseAuth } from "./useFirebaseAuth";
import type { User } from "@shared/schema";

export function useAuth() {
  const { user: firebaseUser, loading } = useFirebaseAuth();

  // Map Firebase user to legacy User interface for compatibility
  const user: User | null = firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    firstName: firebaseUser.displayName?.split(' ')[0] || null,
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || null,
    profileImageUrl: firebaseUser.photoURL,
    streak: 0,       // Default streak, will be fetched from Firestore later
    level: 'Bronze', // Default level, will be fetched from Firestore later
    points: 0,       // Default points, will be fetched from Firestore later
    modelDefaults: {
      flashcards: 'gpt-4',
      qa: 'gpt-4',
    },
    settings: {
      theme: 'light',
      notifications: true,
      reducedMotion: false,
    },
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(), // Will be fetched from Firestore later
    updatedAt: new Date(), // Will be fetched from Firestore later
  } : null;

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!firebaseUser,
  };
}
