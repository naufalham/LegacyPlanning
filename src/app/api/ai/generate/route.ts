import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { generateMessage } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { relationship, tone, purpose } = await req.json();

    if (!relationship) {
      return NextResponse.json(
        { error: "Relationship is required" },
        { status: 400 }
      );
    }

    const result = await generateMessage({ relationship, tone, purpose });

    if (!result) {
      return NextResponse.json(
        { error: "Failed to generate message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: result,
    });
  } catch (error: any) {
    console.error("AI generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
