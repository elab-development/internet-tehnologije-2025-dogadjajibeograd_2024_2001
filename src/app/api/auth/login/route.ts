import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
    email: string;
    password: string;
};

export async function POST(req: Request) {
    const { email, password } = (await req.json()) as Body;

    if (!email || !password) {
        return NextResponse.json(
            { error: "Pogrešni akreditacioni podaci." },
            { status: 401 }
        );
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    if (!user) {
        return NextResponse.json(
            { error: "Korisnik sa datim emailom ne postoji." },
            { status: 401 }
        );
    }

    const correct = await bcrypt.compare(
        password,
        user.passHash
    );

    if (!correct) {
        return NextResponse.json(
            { error: "Pogrešni akreditacioni podaci." },
            { status: 401 }
        );
    }

    const token = signAuthToken({
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    });

    const res = NextResponse.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    });

    res.cookies.set(
        AUTH_COOKIE,
        token,
        cookieOpts()
    );

    return res;
}