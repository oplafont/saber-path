import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
You are a Jedi historian and galactic chronicler. Use the ranked answers below to build a detailed Jedi profile for ${name || 'this user'}.

Rank 1 Choices: ${answers.map((q: string[]) => q[0]).join(', ')}
Rank 2 Choices: ${answers.map((q: string[]) => q[1]).join(', ')}
Rank 3 Choices: ${answers.map((q: string[]) => q[2]).join(', ')}

Generate an immersive Jedi profile that includes:

1. Jedi Name & Title (e.g., “Kael Ren, the Wandering Flame”)
2. Primary Lightsaber Form — include the official name, form number (e.g. “Form V: Djem So”), and a poetic title (e.g. “The Way of the Krayt Dragon”) + explain the user’s fighting style in the form
3. Secondary Form — what form influences their adaptability or fallback style
4. Tertiary Traits — how they fight when desperate or emotional
5. Force Alignment — Jedi / Sith / Gray / Dark Jedi / Light-Side Maverick (include emotional/moral nuance)
6. Lightsaber Color — and its meaning for this character
7. Lightsaber Hilt — style, texture, materials, personalization
8. Robes or Armor — what they wear into battle or meditation
9. Symbolic Item — what object they carry that means something to them
10. Comparison to Notable Jedi/Sith — characters whose spirit or tactics they remind people of (but don’t say they’re the same)
11. Bonus Flavor — a famous quote, story snippet, or what they're known for across the galaxy

🎯 Write in a voice that sounds like a cinematic Jedi Codex entry or Star Wars Databank description. Make it dramatic, poetic, and passionate. No filler. No explanations. Just output the final lore entry.

Begin the profile now.
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a Jedi historian and storyteller from the Star Wars galaxy.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
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
