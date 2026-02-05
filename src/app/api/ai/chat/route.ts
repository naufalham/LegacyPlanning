import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { askAI } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Call AI service
    const result = await askAI(message, "assistant", history || []);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to get AI response",
          content: result.content,
          warnings: result.warnings,
        },
        { status: result.error === "Sensitive data detected" ? 400 : 500 }
      );
    }

    return NextResponse.json({
      content: result.content,
      sanitized: result.sanitized,
      warnings: result.warnings,
    });
  } catch (error: any) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
