import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function chatWithGroq(
  messages: Array<{ role: string; content: string }>,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }
) {
  try {
    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: options?.model || "llama-3.1-70b-versatile",
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 1024,
    });

    return {
      success: true,
      content: completion.choices[0]?.message?.content || "",
      usage: completion.usage,
    };
  } catch (error: any) {
    console.error("Groq AI error:", error);
    return {
      success: false,
      error: error.message,
      content: "",
    };
  }
}
