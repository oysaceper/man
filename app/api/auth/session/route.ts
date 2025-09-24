import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ user: null });
    }

    try {
      const sessionData = JSON.parse(userSession.value);
      
      // Verify user still exists in database
      const dbUser = await db
        .select()
        .from(user)
        .where(eq(user.id, sessionData.id))
        .limit(1);

      if (dbUser.length === 0) {
        // User no longer exists, clear session
        const response = NextResponse.json({ user: null });
        response.cookies.delete('user_session');
        return response;
      }

      const foundUser = dbUser[0];

      return NextResponse.json({ 
        user: {
          id: foundUser.id,
          name: foundUser.name,
          username: foundUser.username,
          role: foundUser.role,
          email: foundUser.email,
          image: foundUser.image,
        }
      });

    } catch (parseError) {
      // Invalid session data, clear it
      const response = NextResponse.json({ user: null });
      response.cookies.delete('user_session');
      return response;
    }

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}