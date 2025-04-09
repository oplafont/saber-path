import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
You are a wise Jedi historian and galactic archivist. Based on the user's ranked answers, you will generate a full Star Wars-style Jedi profile with vivid storytelling and immersive flair.

Details provided:
- Jedi name: ${name || 'Unnamed Padawan'}
- Rank 1 choices: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2 choices: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3 choices: ${answers.map((q: string[]) => q[2]).join(', ')}

Now, generate their Jedi profile including:

1. **Jedi Name and Title** (e.g., Master Kael Varn, The Relentless Sentinel)
2. **Primary Lightsaber Form** (e.g., Form III – Soresu: The Way of the Mynock) — explain its combat style and how it defines them.
3. **Secondary Influence Form** — describe how another form supports their personality or fighting under pressure.
4. **Tertiary Trait** — what emerges when instincts take over.
5. **Force Alignment** — Light Side, Gray Jedi, Dark Side, etc. Add emotional/philosophical reasoning.
6. **Lightsaber** — Color (canon: blue, green, purple, yellow, red, white), hilt appearance, and ignition sound.
7. **Robes or Armor** — Describe appearance and symbolism.
8. **Symbolic Item** — Something they carry that reflects who they are.
9. **Similar Jedi or Sith** — 1–2 known characters they resemble in spirit or fighting style.
10. **Full cinematic intro paragraph** — Write like the narrator of a Star Wars movie, dramatic and poetic, as if this Jedi is entering the story.

Do not mention score or quiz mechanics. Format clearly. Make it feel like an official Star Wars databank entry.
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
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
