import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Middleware untuk role-based access
export async function middleware(req: NextRequest) {
  // Contoh: Ambil user dari session/cookie (implementasi session menyusul)
  // const user = ...
  // if (!user) return NextResponse.redirect("/login");
  // if (user.role !== "admin") return NextResponse.redirect("/unauthorized");
  // Untuk demo, middleware hanya template
  return NextResponse.next();
}
