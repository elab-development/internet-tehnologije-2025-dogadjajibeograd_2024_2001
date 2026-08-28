import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt, { compare } from "bcrypt";
import { POST } from "./route";
import { db } from "@/db";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import { emit } from "process";

vi.mock("@/db", () => ({
    db: {
        select: vi.fn()
    },
}));

vi.mock("bcrypt", () => ({
    default: {
        compare: vi.fn()
    },
}));

vi.mock("@/lib/auth", () => ({
    AUTH_COOKIE: "auth_token",
    cookieOpts: vi.fn(() => ({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
    })),
    signAuthToken: vi.fn(() => "test-jwt-token"),
}));

describe("POST /api/auth/login", () => {
    const mockUser = {
        id: "pod12ds",
        email: "pera.peric@example.com",
        firstname: "Petar",
        lastname: "Peric",
        dateOfBirth: "1998-05-14",
        role: "user",
        passHash: "hashed-password",
    }

    beforeEach(() => {
        vi.clearAllMocks();
    })
    it("uspešno prijavljuje korisnika", async () => {
        const whereMock = vi.fn().mockResolvedValue([mockUser]);

        const fromMock = vi.fn(() => ({
            where: whereMock,
        }));

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

        const request = new Request(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "petar@example.com",
                    password: "Petar123!",
                }),
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);

        expect(data).toEqual({
            id: mockUser.id,
            email: mockUser.email,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            dateOfBirth: mockUser.dateOfBirth,
            role: mockUser.role,
        });

        expect(bcrypt.compare).toHaveBeenCalledWith(
            "Petar123!",
            mockUser.passHash
        );

        expect(signAuthToken).toHaveBeenCalledWith({
            sub: mockUser.id,
            email: mockUser.email,
            firstname: mockUser.firstname,
            lastname: mockUser.lastname,
            dateOfBirth: mockUser.dateOfBirth,
            role: mockUser.role,
        });

        const cookie = response.headers.get("set-cookie");

        expect(cookie).toContain(
            "auth_token=test-jwt-token"
        );
    });

    it("vraća 401 kada email nije prosleđen", async () => {
        const request = new Request(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    password: mockUser.passHash,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({
            error: "Pogrešni akreditacioni podaci.",
        });
    });

    vi.clearAllMocks();

    it("vraća 401 kada email ne postoji u bazi", async () => {
        const whereMock = vi.fn().mockResolvedValue([]);

        const fromMock = vi.fn(() => ({
            where: whereMock,
        }));

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: "pogresnaadresa@example.com",
                    password: "Petar123!",
                }),
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);

        expect(data).toEqual({
            error: "Korisnik sa datim emailom ne postoji.",
        });
    });

    vi.clearAllMocks();

    it("vraća 401 kada pasword nije prosleđen", async () => {
        const request = new Request(
            "http://localhost:3000/api/auth/login",
            {
                method: "POST",
                body: JSON.stringify({
                    email: mockUser.email,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data).toEqual({
            error: "Pogrešni akreditacioni podaci.",
        });
    });


});

