import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth-helpers';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authenticatedUser = await authenticateUser({ username, password });

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Find the user in the database to get the complete user object
    const dbUser = await db
      .select()
      .from(user)
      .where(eq(user.id, authenticatedUser.id))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const foundUser = dbUser[0];

    // Create session data
    const sessionData = {
      id: foundUser.id,
      name: foundUser.name,
      username: foundUser.username,
      role: foundUser.role,
      email: foundUser.email,
      image: foundUser.image,
    };

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: sessionData,
      redirectUrl: '/dashboard',
    });

    // Set session cookie (expires in 7 days)
    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}