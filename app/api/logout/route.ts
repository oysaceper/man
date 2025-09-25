import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Clear the auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");

    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}