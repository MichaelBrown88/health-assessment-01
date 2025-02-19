import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db: any;
let initError: Error | null = null;

function formatPrivateKey(key: string): string {
  // Remove quotes and replace escaped newlines
  return key.replace(/\\n/g, '\n').replace(/^["']|["']$/g, '');
}

// Initialize Firebase Admin if not already initialized
try {
  const apps = getApps();
  
  if (!apps.length) {
    // Validate required environment variables
    const requiredEnvVars = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY
    };

    // Check for missing environment variables
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Format private key
    const privateKey = formatPrivateKey(requiredEnvVars.privateKey as string);

    // Initialize Firebase Admin
    console.log('Initializing Firebase Admin SDK with config:', {
      projectId: requiredEnvVars.projectId,
      clientEmail: requiredEnvVars.clientEmail,
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey.length
    });

    const app = initializeApp({
      credential: cert({
        projectId: requiredEnvVars.projectId,
        clientEmail: requiredEnvVars.clientEmail,
        privateKey: privateKey,
      })
    });

    console.log('Firebase Admin SDK initialized successfully');
    db = getFirestore();
    console.log('Firestore instance created');
  } else {
    console.log('Firebase Admin SDK already initialized');
    db = getFirestore();
  }
} catch (error) {
  console.error('Firebase initialization error:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
  initError = error instanceof Error ? error : new Error('Unknown initialization error');
}

export async function POST(req: Request) {
  // Check if Firebase is initialized
  if (!db) {
    const errorMessage = initError ? initError.message : 'Database not initialized';
    console.error('Database error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    
    // Log the incoming request
    console.log('Processing lead creation:', {
      hasName: !!body.name,
      hasEmail: !!body.email,
      hasAnswers: !!body.answers,
      hasAssessmentResults: !!body.assessmentResults
    });

    // Validate required fields
    const { name, email, answers, assessmentResults, timestamp } = body;

    if (!name || !email || !answers || !assessmentResults) {
      console.error('Missing required fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasAnswers: !!answers,
        hasResults: !!assessmentResults
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the lead document
    const leadData = {
      name,
      email: email.toLowerCase(),
      answers,
      assessmentResults,
      timestamp: timestamp || Date.now(),
      status: 'guest',
      createdAt: new Date(),
      metrics: {
        overallScore: assessmentResults.score,
        exerciseScore: assessmentResults.healthCalculations.exerciseScore || 0,
        nutritionScore: assessmentResults.healthCalculations.nutritionScore || 0,
        mentalHealthScore: assessmentResults.healthCalculations.mentalHealthScore || 0,
        sleepScore: assessmentResults.healthCalculations.sleepScore || 0
      }
    };

    console.log('Creating lead document...');
    const leadRef = await db.collection('leads').add(leadData);
    console.log('Lead document created:', leadRef.id);

    return NextResponse.json({ 
      success: true, 
      leadId: leadRef.id 
    });

  } catch (error) {
    console.error('Lead creation error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Failed to save information' },
      { status: 500 }
    );
  }
}
