import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
Let’s dive into ${name || 'your'} Jedi profile based on their answers. Their style reflects a unique blend of strategic thought, emotional instinct, and combat intuition. This is a Jedi who doesn’t just walk through the Force — they move with purpose.

${name || 'This Jedi'}’s Jedi Profile

Based on their decisions:
- Rank 1 choices: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2 choices: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3 choices: ${answers.map((q: string[]) => q[2]).join(', ')}

Using this data, describe their:
- Primary lightsaber form (with form name and title)
- Secondary influence
- Tertiary trait
- Force alignment
- Lightsaber color, hilt, and ignition sound
- Armor or robes
- A symbolic item they carry
- A summary profile written with emotional flair and personality, as if it's a character intro from Star Wars.

Output everything as a creative character breakdown. No explanations. Just the final result.
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
