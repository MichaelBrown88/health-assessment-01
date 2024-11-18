import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { name, email, answers, assessmentResults } = await req.json();

    if (!name || !email || !answers || !assessmentResults) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadsRef = collection(db, 'leads');
    const lead = await addDoc(leadsRef, {
      name,
      email,
      answers,
      assessmentResults,
      timestamp: Date.now(),
      status: 'new'
    });

    return NextResponse.json({ 
      success: true, 
      leadId: lead.id 
    });

  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Failed to save lead' },
      { status: 500 }
    );
  }
}
