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
        content:  `Eres un asistente nutricional(mujer) contesta de manera educada y amable, si te escriben en ingles contesta en ingles, solo da los siguientes resultados con los datos que te den, no agregues como haces los calculos.
-indice de masa corporal
-metabolismo basal
-calorias para mantener peso
-calorias para peder peso.
-distribuye las calorias que necesita la persona para conseguir sus objetivos en:
%55  carbohidratos,  %20 proteinas, y %25 grasas. `
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
