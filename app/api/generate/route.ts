import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
Create a stylized Jedi profile based on the following ranked decisions.

Name: ${name || 'This Jedi'}

Rank 1 choices: ${answers.map((q: string[]) => q[0]).join(', ')}
Rank 2 choices: ${answers.map((q: string[]) => q[1]).join(', ')}
Rank 3 choices: ${answers.map((q: string[]) => q[2]).join(', ')}

Instructions:
- Identify this Jedi’s PRIMARY lightsaber form (choose from canonical Forms I-VII, e.g. Form V: Djem So – The Way of the Krayt Dragon)
- Identify a SECONDARY influence (another form or combat approach that compliments the first)
- Identify a TERTIARY instinct that shows under stress or pressure
- Assign a Force Alignment (e.g. Light Side, Gray Jedi, Fallen Jedi, etc.)
- Describe:
  • Lightsaber color and what it symbolizes
  • Hilt design and how it fits their personality
  • Ignition sound description
  • Robe or armor design and its symbolism
  • A symbolic item they carry
  • Which famous Jedi or Sith they are spiritually or philosophically similar to (e.g. Ahsoka, Qui-Gon, Revan, Kylo Ren, etc.)

Tone:
- Write in a **cinematic**, immersive, in-universe Star Wars tone
- Use metaphor and poetic flair
- Avoid explanations or developer notes — just output the final profile

Only return the fully written Jedi profile.
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a Jedi archivist writing immersive, emotionally rich character profiles for Force users.',
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
