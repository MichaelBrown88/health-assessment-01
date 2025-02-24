import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Simple delay function for retries
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests

export async function POST(request: Request) {
  try {
    // Basic rate limiting
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      return NextResponse.json({ 
        error: 'Please wait a few seconds between requests.' 
      }, { status: 429 });
    }
    lastRequestTime = now;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || !(apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-'))) {
      console.error('Invalid or missing OpenAI API key');
      return NextResponse.json({ error: 'OpenAI API key is not properly configured' }, { status: 500 });
    }

    const openai = new OpenAI({ 
      apiKey,
      maxRetries: 2,
      timeout: 15000 // 15 second timeout
    });

    const { question, context } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!context) {
      return NextResponse.json({ error: 'Context is required' }, { status: 400 });
    }

    const { score = 'not provided', bmi = 'not provided', activityLevel = 'not provided' } = context;

    // Maximum number of retries
    const maxRetries = 2;
    let retryCount = 0;
    let lastError = null;

    while (retryCount < maxRetries) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `As a health coach, provide brief, focused advice based on: Score=${score}, BMI=${bmi}, Activity=${activityLevel}.`
            },
            {
              role: "user",
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 150, // Reduced token count
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        });

        return NextResponse.json({ response: completion.choices[0].message.content });
      } catch (error: any) {
        console.error('OpenAI API Error:', error);
        lastError = error;

        if (error.status === 429) {
          // Rate limit hit - wait longer between retries
          const waitTime = Math.pow(2, retryCount + 1) * 1000; // Exponential backoff
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${retryCount + 1}`);
          await delay(waitTime);
          retryCount++;
          continue;
        }

        throw error; // Re-throw other errors
      }
    }

    // If we get here, we've exhausted our retries
    console.error('Max retries reached:', lastError);
    return NextResponse.json({ 
      error: 'Service is currently busy. Please try again in a few moments.' 
    }, { status: 429 });

  } catch (error: any) {
    console.error('General Error:', error);
    
    if (error.status === 401) {
      return NextResponse.json({ 
        error: 'Authentication error. Please check your API key configuration.' 
      }, { status: 401 });
    }
    
    if (error.status === 429) {
      return NextResponse.json({ 
        error: 'Service is busy. Please wait a moment and try again.' 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: 'Internal server error. Please try again later.' 
    }, { status: 500 });
  }
}
