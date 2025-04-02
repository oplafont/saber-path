import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { answers } = await req.json();

  const formattedAnswers = answers
    .map((q: string[], i: number) => `Q${i + 1}: 1-${q[0]}, 2-${q[1]}, 3-${q[2]}`)
    .join('\n');

    const prompt = `
    You're a Jedi loremaster and spiritual profiler. You analyze Force users based on their behavioral decisions.
    
    The user has ranked 3 choices per scenario. Based on this, give them a Jedi-style character profile in the following exact format:
    
    ---
    
    Let’s dive into [NAME]’s Jedi profile based on their answers. Their style reflects a unique blend of [emotional tone, combat instincts, moral leanings]. This is a Jedi who doesn't just walk through the Force—they flow with it.
    
    [NAME]’s Jedi Profile
    
    Primary Form: [Form Name + Nickname]
    [Brief poetic description—how they fight, how they feel when using it, what situations they thrive in]
    
    Secondary Influence: [Form Name + Nickname]
    [What it adds to their style. How it balances their nature. When it shows up.]
    
    Tertiary Trait: [Form Name + Nickname]
    [How it emerges when they’re pushed. What this form says about their instincts.]
    
    Force Alignment: [Tone, like Chaotic Good / Grey-Leaning Light]
    [Explain how they see the Force—emotional or rational, loyal or independent. Reference key values.]
    
    Lightsaber Stats:
    
    Color: [Color and meaning behind it]
    
    Hilt: [Describe it as if we’re holding it]
    
    Ignition Sound: [Describe sound + feel]
    
    Summary:
    
    Trait\t\tDescription
    Primary Form\t[One-liner]
    Secondary\t\t[One-liner]
    Tertiary\t\t[One-liner]
    Alignment\t\t[One-liner]
    Combat Vibe\t[One-liner]
    
    Finish with a final sentence or two that reads like a Jedi myth being born—emotional, elegant, legendary.
    
    Here are the user’s ranked answers:
    ${formattedAnswers}
    `;
    

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a Star Wars character builder and Jedi loremaster.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.85
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('OpenAI API Error:', data);
    return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 });
  }

  return NextResponse.json({ result: data.choices[0].message.content });
}
