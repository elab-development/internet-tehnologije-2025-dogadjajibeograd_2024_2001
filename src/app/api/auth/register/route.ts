import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
};

export async function POST(req: Request) {
    const {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
    } = (await req.json()) as Body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
        return NextResponse.json(
            { error: "Sva polja su obavezna." },
            { status: 400 }
        );
    }

    const [existingUser] = await db
        .select({
            id: users.id,
        })
        .from(users)
        .where(eq(users.email, email));

    if (existingUser) {
        return NextResponse.json(
            { error: "Korisnik sa ovim emailom već postoji." },
            { status: 409 }
        );
    }

    const passHash = await bcrypt.hash(password, 10);

    const [user] = await db
        .insert(users)
        .values({
            firstName,
            lastName,
            email,
            passHash,
            dateOfBirth,
        })
        .returning({
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            dateOfBirth: users.dateOfBirth,
            role: users.role,
        });

    const token = signAuthToken({
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    });

    const res = NextResponse.json(
        {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            role: user.role,
        },
        { status: 201 }
    );

    res.cookies.set(
        AUTH_COOKIE,
        token,
        cookieOpts()
    );

    return res;
}