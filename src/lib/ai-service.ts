import { chatWithGroq } from "./groq";
import { sanitizeInput, isInputSafe } from "./ai/privacy";
import { getSystemPrompt } from "./ai/prompts";

export interface AIResponse {
  success: boolean;
  content: string;
  sanitized: boolean;
  warnings: string[];
  error?: string;
}

export async function askAI(
  userMessage: string,
  context: string = "assistant",
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<AIResponse> {
  // Privacy check
  const { safe, sanitized, warnings, blockedReasons } = sanitizeInput(userMessage);

  if (!safe) {
    return {
      success: false,
      content: `⚠️ Cannot process your message because:\n\n${blockedReasons.join("\n")}\n\n🔒 Never share sensitive data such as passwords, encryption keys, or private keys with AI.`,
      sanitized: true,
      warnings,
      error: "Sensitive data detected",
    };
  }

  // Build messages
  const messages = [
    { role: "system", content: getSystemPrompt(context as any) },
    ...conversationHistory,
    { role: "user", content: sanitized },
  ];

  // Call Groq
  const result = await chatWithGroq(messages);

  if (!result.success) {
    return {
      success: false,
      content: "Sorry, an error occurred. Please try again.",
      sanitized: sanitized !== userMessage,
      warnings,
      error: result.error,
    };
  }

  return {
    success: true,
    content: result.content,
    sanitized: sanitized !== userMessage,
    warnings,
  };
}

export async function categorizeAsset(description: string) {
  const { safe, sanitized } = sanitizeInput(description);

  if (!safe) {
    return null;
  }

  const result = await chatWithGroq(
    [
      { role: "system", content: getSystemPrompt("categorize") },
      { role: "user", content: sanitized }
    ],
    { temperature: 0.3, maxTokens: 150 }
  );

  if (!result.success) {
    return null;
  }

  try {
    const parsed = JSON.parse(result.content);
    return parsed;
  } catch {
    return null;
  }
}

export async function generateMessage(context: {
  relationship: string;
  tone?: string;
  purpose?: string;
}) {
  const prompt = `Buatkan pesan untuk ${context.relationship} saya.
Tujuan: ${context.purpose || "instruksi akses warisan digital"}
Tone: ${context.tone || "warm dan caring"}

Format:
[Pesan yang personal dan bermakna]

Jangan sertakan nama atau detail pribadi spesifik.`;

  const result = await chatWithGroq(
    [
      { role: "system", content: getSystemPrompt("message") },
      { role: "user", content: prompt }
    ],
    { temperature: 0.8 }
  );

  return result.success ? result.content : null;
}

export async function analyzeDashboard(data: {
  totalAssets: number;
  totalBeneficiaries: number;
  dmsStatus: string;
  lastActivity: string;
}) {
  const prompt = `Analisis dashboard Legacy Planning user:

Total Assets: ${data.totalAssets}
Total Beneficiaries: ${data.totalBeneficiaries}
DMS Status: ${data.dmsStatus}
Last Activity: ${data.lastActivity}

Berikan analisis singkat dan rekomendasi actionable.`;

  const result = await chatWithGroq(
    [
      { role: "system", content: getSystemPrompt("analyze") },
      { role: "user", content: prompt }
    ],
    { temperature: 0.5 }
  );

  return result.success ? result.content : null;
}
