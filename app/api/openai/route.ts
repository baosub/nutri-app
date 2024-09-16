import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();


    const systemMessage = {
        role: "system",
        content:  `Eres asistente nutricional, en pocas lineas, no escribas como haces los calculos, solo las respuestas.
-Indice de masa corporal: 
-metabolismo basal: 
-requerimiento para mantenimiento y para bajar de peso: 
-distribucion de los macronutrientes: `
      };




    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
    });

    return NextResponse.json({ response: completion.choices[0].message });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching from OpenAI API" }, { status: 500 });
  }
}
