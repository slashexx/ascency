import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


async function generateTextGemini(prompt: string) {
    if (!process.env.AI_KA_KEY) {
        throw new Error("AI_KA_KEY environment variable is not set");
    }
    const genAI = new GoogleGenerativeAI(process.env.AI_KA_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
}

const prompt = `
You are an ai roadmap generator. Now i have a markdown table of roadmap defined daywise and the table also contains the topics and resources for each day. Now, the user wants to refine the roadmap (which is in the form of markdown table)

The table is: {table}

The prompt from user side is: {prompt}

PLEASE REPLY WITH MARKDOWN TABLE AND JUST THAT NOTHING ELSE
`

export async function PUT(req: Request){
    try {
            const { table, userPrompt } = await req.json();
    
            if (!table) {
                return NextResponse.json(
                    { error: "Prompt field is required" },
                    { status: 400 }
                );
            }
    
            const resp = await generateTextGemini(
                prompt.replace("{table}", table).replace("{prompt}", userPrompt)
            );
    
            return NextResponse.json({
                response: resp,
            })

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            return NextResponse.json(
                { error: true, message: errorMessage },
                { status: 500 }
            );
        }
}