import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { answers, name } = await req.json();

    const prompt = `
Create a complete and consistent Jedi profile using canonical Star Wars terms and structure. The name provided is: ${name || 'Unnamed Jedi'}.

Based on the following ranked choices:
- Rank 1: ${answers.map((q: string[]) => q[0]).join(', ')}
- Rank 2: ${answers.map((q: string[]) => q[1]).join(', ')}
- Rank 3: ${answers.map((q: string[]) => q[2]).join(', ')}

Use this information to create a stylized and lore-accurate Jedi profile that includes:

1. Full Jedi Name and Title
2. Primary Lightsaber Form (e.g., "Form IV: Ataru – The Way of the Hawk-Bat") and what it says about their combat style
3. Secondary Form Influence with combat and personality relevance
4. Tertiary Form Trait used under pressure or in unique circumstances
5. Force Alignment (e.g., Jedi Consular, Sith Warrior, Gray Jedi, etc.)
6. Lightsaber Color and what it symbolizes
7. Lightsaber Hilt Design (material, shape, customizations)
8. Robes/Armor Appearance (colors, condition, style, any personal touches)
9. Symbolic Item carried by the Jedi and its significance
10. A dramatic, emotionally rich backstory and summary styled like a Star Wars cinematic introduction.

Stick strictly to Star Wars naming and lore tone. No generic summaries or disclaimers. This is an immersive in-universe character reveal.
`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a wise Jedi historian and storyteller within the Star Wars universe.',
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
