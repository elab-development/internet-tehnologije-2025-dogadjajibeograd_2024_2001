export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

export async function GET() {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
        return NextResponse.json({ user: null }, {status: 401});
    }

    try {
        const claims = verifyAuthToken(token);

        const [user] = await db.select({
            id: users.id,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            dateOfBirth: users.dateOfBirth,
            role: users.role,
            createdAt: users.createdAt
        })
            .from(users)
            .where(eq(users.id, claims.sub));

         if (!user) {
            return NextResponse.json(
                { user: null },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user,
        });
    } catch {
        return NextResponse.json({ users: null }, { status: 401 })
    }
}