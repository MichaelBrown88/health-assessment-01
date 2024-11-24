import { db } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, answers, assessmentResults, acceptedTerms, timestamp } = body;

    if (!name || !email || !answers || !assessmentResults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new lead document
    const leadRef = await db.collection('leads').add({
      name,
      email,
      answers,
      assessmentResults,
      acceptedTerms,
      timestamp,
      status: 'new',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      leadId: leadRef.id 
    });

  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Failed to save information' },
      { status: 500 }
    );
  }
}
