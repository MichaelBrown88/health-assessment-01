import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// At the top of the file, add these interfaces
interface FeedbackItem {
  color: string;
  item: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('API route hit'); // Add this line

  if (!process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not configured'); // Add this line
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Received body:', JSON.stringify(body, null, 2)); // Pretty print the body

    if (!body || !body.summary || !Array.isArray(body.summary)) {
      console.log('Invalid request body'); // Add this line
      return NextResponse.json({ error: 'Invalid request body. Expected summary array.' }, { status: 400 });
    }

    const { summary } = body;

    // Process the analysis result to identify strengths and areas for improvement
    const strengths = [];
    const areasForImprovement = [];

    for (const section of summary) {
      const allGreen = section.feedbackItems.every((item: FeedbackItem) => item.color === 'green');
      if (allGreen) {
        strengths.push(section.title);
      } else {
        const improvements = section.feedbackItems
          .filter((item: FeedbackItem) => item.color === 'amber' || item.color === 'red')
          .map((item: FeedbackItem) => item.item);
        areasForImprovement.push({ section: section.title, items: improvements });
      }
    }

    const prompt = `Generate a concise health analysis summary based on the following information:
      Strengths: ${JSON.stringify(strengths)}
      Areas for Improvement: ${JSON.stringify(areasForImprovement)}
      
      The summary should be encouraging, highlight key areas for improvement, and mention strengths. Keep it under 250 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates health analysis summaries." },
        { role: "user", content: prompt }
      ],
    });

    const aiSummary = completion.choices[0].message.content;

    return NextResponse.json({ summary: aiSummary });
  } catch (error: unknown) {
    console.error('Error in generate-summary API:', error);
    return NextResponse.json({ error: 'An error occurred while generating the summary' }, { status: 500 });
  }
}
