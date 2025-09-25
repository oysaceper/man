import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  return NextResponse.json(user);
}