// Firebase authentication middleware for Express.js
import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error('Firebase project ID is required');
    }

    try {
      return admin.initializeApp({
        projectId,
      });
    } catch (error) {
      console.warn('Firebase Admin initialization failed:', error);
      throw error;
    }
  }
  return admin.app();
}

// Extend Express Request type to include Firebase user
export interface FirebaseUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  picture?: string;
}

declare global {
  namespace Express {
    interface Request {
      firebaseUser?: FirebaseUser;
    }
  }
}

export function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const adminApp = getFirebaseAdmin();
    
    adminApp.auth().verifyIdToken(token)
      .then((decodedToken: admin.auth.DecodedIdToken) => {
        req.firebaseUser = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name,
          picture: decodedToken.picture,
        };
        next();
      })
      .catch((error: any) => {
        console.error('Token verification error:', error);
        res.status(403).json({ error: 'Invalid token' });
      });
  } catch (error: any) {
    console.error('Firebase auth middleware error:', error);
    res.status(500).json({ error: 'Authentication service error' });
  }
}

// Optional middleware - doesn't fail if no token provided
export function optionalFirebaseAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without user info
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const adminApp = getFirebaseAdmin();
    
    adminApp.auth().verifyIdToken(token)
      .then((decodedToken: admin.auth.DecodedIdToken) => {
        req.firebaseUser = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          name: decodedToken.name,
          picture: decodedToken.picture,
        };
        next();
      })
      .catch(() => {
        // Token invalid, but continue without user info
        next();
      });
  } catch (error: any) {
    console.error('Firebase auth middleware error:', error);
    next(); // Continue without user info
  }
}