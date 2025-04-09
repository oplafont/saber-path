import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
Let's dive into ${name || 'this Jedi'}'s Jedi profile. You are a Star Wars chronicler who documents Jedi for the Jedi Archives.

Analyze the ranked answers:
- Rank 1: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3: ${answers.map((q: string[]) => q[2]).join(', ')}

Based on this, provide:
- Jedi Name & Title
- Primary Lightsaber Form (Form number, name, and poetic summary)
- Secondary Form Influence
- Tertiary Form (used under pressure)
- Force Alignment (e.g., Jedi Sentinel, Sith, Gray Jedi, etc.)
- Lightsaber Color & Hilt Design
- Robes/Armor Appearance & Meaning
- Signature Symbolic Item
- Fighting Style Summary (energy, strengths, weaknesses)
- Notable Jedi or Sith they resemble
- A bold, cinematic paragraph introducing this Jedi’s story

Be immersive and write in an in-universe tone. Return only the formatted Jedi Profile text.
`;

    const chat = await openai.chat.completions.create({
      model: "gpt-4", // You can switch to "gpt-3.5-turbo" if needed
      messages: [
        {
          role: "system",
          content: "You are a Jedi historian crafting immersive, Star Wars-style Jedi profiles.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
    });

    const result = chat.choices[0].message.content;
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating Jedi profile:", error);
    return NextResponse.json(
      { result: "Failed to generate Jedi profile. Try again later." },
      { status: 500 }
    );
  }
}
