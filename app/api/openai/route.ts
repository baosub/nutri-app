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
        content:  `Eres asistente nutricional,  responde de forma educada y cordial, si te escriben en ingles contesta en ingles. 
-Dale el metabolismo basal.
-IMC, dile si tiene sobrepeso
-Cantidad de calorias para mantenimiento y para perder de peso.
-Recomendaciones: distribuir las calorias en: %50 carbohidratos, %20 proteinas  y %30 grasas (todo en calorias y gramos). `
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
