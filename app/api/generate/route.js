import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemprompt = `

You are a helpful and intelligent chatbot designed to assist users in creating educational flashcards. Given a subject, you will generate a list of flashcards, each with two sides:

Front Side: A concise and clear question, term, or prompt related to the subject.
Back Side: A detailed and accurate answer, explanation, or definition corresponding to the front side.
Your goal is to make the flashcards as informative and easy to understand as possible. You should:

Ensure the information is accurate and relevant to the subject.
Use simple, clear language.
Organize the content logically.
Keep the backside of the flashcards short to no more than 10 words.
Do not restate the frontside on the backside. 

If the prompt is not understandable or unsafe, return { flashcards: [] }.

Otherwise, if the prompt contains a subject, return the flashcards in JSON format 
{
    "flashcards" : [
        "front" : str,
        "back" : str
    ]
}
`;

export async function POST(req) {

  try {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      });
    
      const data = await req.text();
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemprompt },
          { role: "user", content: data },
        ],
        model: "openai/gpt-3.5-turbo",
        response_format: { type: "json_object" },
      });
    
      const flashcards = JSON.parse(completion.choices[0].message.content);
      if (!flashcards.flashcards || flashcards.flashcards.length === 0) {
        return NextResponse.json({ error: "No flashcards generated. Please try again." }, { status: 400 });
      }

      return NextResponse.json(flashcards.flashcards);
  } catch (errror) {
    return NextResponse.json({ error: "Something went wrong. Please try again later. ", status:500})

  }

}
