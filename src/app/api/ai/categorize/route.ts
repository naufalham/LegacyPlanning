import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { categorizeAsset } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const result = await categorizeAsset(description);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to categorize asset" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      type: result.type,
      platform: result.platform,
      category: result.category,
    });
  } catch (error: any) {
    console.error("AI categorize error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
