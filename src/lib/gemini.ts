import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResult {
    text: string;
    model: string;
    latencyMs: number;
}

export async function generateContent(
    prompt: string,
    model?: string
): Promise<GeminiResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(
            'GEMINI_API_KEY is not configured. Go to Settings to add your API key.'
        );
    }

    const modelName = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const genAI = new GoogleGenerativeAI(apiKey);
    const genModel = genAI.getGenerativeModel({ model: modelName });

    const start = Date.now();
    const result = await genModel.generateContent(prompt);
    const latencyMs = Date.now() - start;

    const text = result.response.text();

    return {
        text,
        model: modelName,
        latencyMs,
    };
}
