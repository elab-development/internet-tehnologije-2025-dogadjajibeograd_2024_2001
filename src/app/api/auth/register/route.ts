import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dateOfBirth: string;
};

export async function POST(req: Request) {
    const {
        firstname,
        lastname,
        email,
        password,
        dateOfBirth,
    } = (await req.json()) as Body;

    if (!email || !password || !firstname || !lastname || !dateOfBirth) {
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
            firstname,
            lastname,
            email,
            passHash,
            dateOfBirth,
        })
        .returning({
            id: users.id,
            firstname: users.firstname,
            lastname: users.lastname,
            email: users.email,
            dateOfBirth: users.dateOfBirth,
            role: users.role,
        });

    const token = signAuthToken({
        sub: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
    });

    const res = NextResponse.json(
        {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
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