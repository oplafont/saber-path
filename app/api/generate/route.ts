// Specify Node.js runtime for OpenAI compatibility
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
You are a Jedi historian and archivist for the High Council.

Create a fully immersive Jedi profile based on the user's choices.
Name: ${name || 'This Jedi'}

Top ranked values:
- Rank 1: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3: ${answers.map((q: string[]) => q[2]).join(', ')}

Create a vivid and deeply descriptive Jedi profile including:
- **Primary lightsaber form** (use real Star Wars form names like Form I: Shii-Cho)
- **Secondary form** with explanation of strategic advantage
- **Force alignment** (e.g., Jedi Sentinel, Sith Acolyte, Gray Jedi, etc.)
- **Lightsaber color**, hilt design (curved, crossguard, etc.), and ignition sound
- **Apparel or armor style** and its symbolism
- **Personality traits** in combat and diplomacy
- **Notable Jedi or Sith they resemble** (e.g. Mace Windu, Revan, Ahsoka, Qui-Gon)
- **Symbolic item** they carry (e.g., a holocron, crystal shard, mask)

Write this as if it were found in an ancient Jedi archive. Stylized, mythic, and cinematic.
Avoid modern language or jokes. Keep it Star Wars canon-flavored.
Do NOT say "Based on the answers above" or refer to the quiz. Just launch into the profile.
    `;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a Jedi historian and storyteller. Respond with only the final immersive Jedi profile.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.9,
    });

    const result = chat.choices[0]?.message?.content || '';
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating Jedi profile:', error);
    return NextResponse.json(
      { result: 'Failed to generate Jedi profile. Try again later.' },
      { status: 500 }
    );
  }
}
