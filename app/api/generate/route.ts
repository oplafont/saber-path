import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { answers, name } = await req.json();

  const prompt = `
Let's dive into ${name || "this Jedi"}'s profile. Their choices paint a clear image of not just a Force-sensitive warrior, but a legend in the making.

Rank 1 Choices: ${answers.map((q: string[]) => q[0]).join(", ")}
Rank 2 Choices: ${answers.map((q: string[]) => q[1]).join(", ")}
Rank 3 Choices: ${answers.map((q: string[]) => q[2]).join(", ")}

Based on these, describe:

- Full Jedi name and title
- Primary Lightsaber Form (e.g. Form V: Djem So – “The Way of the Krayt Dragon”), with poetic insight
- Secondary combat tendency under pressure
- Emotional relationship with the Force (Jedi Code, Gray, or unique outlook)
- Lightsaber color and what it says about them
- Hilt appearance and functionality
- Armor or robes — style, utility, symbolism
- A symbolic item or relic they carry
- Notable Jedi/Sith/Force user they resemble in spirit
- Strengths and weaknesses
- Their reputation across the galaxy (what people say about them)
- Epic backstory summary like the opening crawl of a Star Wars film

Write this in a cinematic and exciting Star Wars tone — don't explain, just present the profile. Use vivid language like you're introducing them in a novel or movie scroll.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    temperature: 0.9,
    messages: [
      {
        role: "system",
        content: "You are a wise Jedi historian and storyteller.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
