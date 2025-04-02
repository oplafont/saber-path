import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
Let’s dive into ${name || 'your'} Jedi profile based on their answers. Their style reflects a unique blend of emotion, instinct, and moral nuance. This Jedi doesn’t just walk through the Force — they flow with it, unpredictable but intentional.

${name || 'This Jedi'}’s Jedi Profile

Based on their ranked choices:
- Rank 1: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3: ${answers.map((q: string[]) => q[2]).join(', ')}

Using this, describe:
- Primary lightsaber form (with poetic title and style summary)
- Secondary form (emotional insight or strategic advantage)
- Tertiary tendency (instincts under pressure)
- Force alignment (emotional philosophy, Jedi/Sith/Gray/etc.)
- Lightsaber color, hilt design, and ignition sound
- Robes or armor and their symbolism
- Symbolic item carried
- Write it all in a stylized, emotionally rich way. Make it feel like a cinematic Star Wars character intro.

Do NOT explain anything outside the profile. Just give the final result, immersive and bold.
`;


    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a wise Jedi historian and storyteller.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.85,
    });

    const result = chat.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating Jedi profile:', error);
    return NextResponse.json(
      { result: 'Failed to generate Jedi profile. Try again later.' },
      { status: 500 }
    );
  }
}
