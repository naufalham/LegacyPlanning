import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { analyzeDashboard } from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = await req.json();

    if (!data.totalAssets === undefined || !data.totalBeneficiaries === undefined) {
      return NextResponse.json(
        { error: "Dashboard data is required" },
        { status: 400 }
      );
    }

    const result = await analyzeDashboard(data);

    if (!result) {
      return NextResponse.json(
        { error: "Failed to analyze dashboard" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysis: result,
    });
  } catch (error: any) {
    console.error("AI analyze error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
