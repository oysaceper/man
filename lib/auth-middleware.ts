import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  refId: string | null;
}

export async function authenticateUser(req: NextRequest): Promise<AuthUser | null> {
  // Get token from Authorization header or cookie
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || 
                req.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    // For simplicity, we'll use the token as the user ID
    // In production, you might want to use JWT or session tokens
    const user = await db.select({
      id: schema.users.id,
      username: schema.users.username,
      roleId: schema.users.roleId,
      refId: schema.users.refId,
    })
    .from(schema.users)
    .where(eq(schema.users.id, token))
    .limit(1);

    if (!user[0]) {
      return null;
    }

    // Get role name
    const role = await db.select()
      .from(schema.roles)
      .where(eq(schema.roles.id, user[0].roleId))
      .limit(1);

    return {
      id: user[0].id,
      username: user[0].username,
      role: role[0]?.name || "",
      refId: user[0].refId,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export function requireAuth(requiredRoles?: string[]) {
  return async (req: NextRequest, context: any, next: () => Promise<NextResponse>) => {
    const user = await authenticateUser(req);

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Add user to request context (this is a simplified approach)
    // In production, you might want to use a more robust context system
    req.headers.set("x-user-id", user.id);
    req.headers.set("x-user-role", user.role);
    req.headers.set("x-user-ref-id", user.refId || "");

    return next();
  };
}

export function getAuthUser(req: NextRequest): AuthUser | null {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role");
  const userRefId = req.headers.get("x-user-ref-id");

  if (!userId || !userRole) {
    return null;
  }

  return {
    id: userId,
    username: "", // We don't pass username through headers for security
    role: userRole,
    refId: userRefId || null,
  };
}