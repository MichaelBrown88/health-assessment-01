import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { question, context } = body;

    if (!question || !context) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable health coach providing personalized advice based on assessment data."
        },
        {
          role: "user",
          content: `Based on the following health data:
            - Overall Score: ${context.score}
            - BMI: ${context.healthCalculations.bmi}
            - Exercise Level: ${context.answers.activityLevel}
            
            Question: ${question}
            
            Provide specific, actionable advice.`
        }
      ],
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('AI Coach API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI coach' },
      { status: 500 }
    );
  }
}
