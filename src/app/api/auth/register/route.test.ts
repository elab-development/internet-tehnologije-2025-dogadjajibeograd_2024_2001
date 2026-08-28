import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import { db } from "@/db";
import {
    AUTH_COOKIE,
    cookieOpts,
    signAuthToken,
} from "@/lib/auth";
import { POST } from "./route";

vi.mock("@/db", () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
    },
}));

vi.mock("bcrypt", () => ({
    default: {
        hash: vi.fn(),
    },
}));

vi.mock("@/lib/auth", () => ({
    AUTH_COOKIE: "auth",
    cookieOpts: vi.fn(() => ({
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        path: "/",
        maxAge: 604800,
    })),
    signAuthToken: vi.fn(() => "test-jwt-token"),
}));

describe("POST /api/auth/register", () => {
    const body = {
        firstname: "Petar",
        lastname: "Petrović",
        email: "petar@example.com",
        password: "Petar123!",
        dateOfBirth: "1998-05-14",
    };

    const createdUser = {
        id: "user-123",
        firstname: "Petar",
        lastname: "Petrović",
        email: "petar@example.com",
        dateOfBirth: "1998-05-14",
        role: "user" as const,
    };

    beforeEach(() => {
        vi.resetAllMocks();

        vi.mocked(signAuthToken).mockReturnValue(
            "test-jwt-token"
        );

        vi.mocked(cookieOpts).mockReturnValue({
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/",
            maxAge: 604800,
        });
    });

    it("uspešno registruje novog korisnika", async () => {
        const whereMock = vi.fn().mockResolvedValue([]);

        const fromMock = vi.fn().mockReturnValue({
            where: whereMock,
        });

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        vi.mocked(bcrypt.hash).mockResolvedValue(
            "hashed-password" as never
        );

        const returningMock = vi
            .fn()
            .mockResolvedValue([createdUser]);

        const valuesMock = vi.fn().mockReturnValue({
            returning: returningMock,
        });

        vi.mocked(db.insert).mockReturnValue({
            values: valuesMock,
        } as any);

        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);

        expect(data).toEqual(createdUser);
    });

    it("hashuje lozinku pre upisa u bazu", async () => {
        const whereMock = vi.fn().mockResolvedValue([]);

        const fromMock = vi.fn().mockReturnValue({
            where: whereMock,
        });

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        vi.mocked(bcrypt.hash).mockResolvedValue(
            "hashed-password" as never
        );

        const returningMock = vi
            .fn()
            .mockResolvedValue([createdUser]);

        const valuesMock = vi.fn().mockReturnValue({
            returning: returningMock,
        });

        vi.mocked(db.insert).mockReturnValue({
            values: valuesMock,
        } as any);

        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );

        await POST(request);

        expect(bcrypt.hash).toHaveBeenCalledWith(
            "Petar123!",
            10
        );

        expect(valuesMock).toHaveBeenCalledWith({
            firstname: "Petar",
            lastname: "Petrović",
            email: "petar@example.com",
            passHash: "hashed-password",
            dateOfBirth: "1998-05-14",
        });
    });

    it("kreira JWT token za registrovanog korisnika", async () => {
        const whereMock = vi.fn().mockResolvedValue([]);

        vi.mocked(db.select).mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: whereMock,
            }),
        } as any);

        vi.mocked(bcrypt.hash).mockResolvedValue(
            "hashed-password" as never
        );

        vi.mocked(db.insert).mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi
                    .fn()
                    .mockResolvedValue([createdUser]),
            }),
        } as any);

        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );

        await POST(request);

        expect(signAuthToken).toHaveBeenCalledWith({
            sub: "user-123",
            firstname: "Petar",
            lastname: "Petrović",
            email: "petar@example.com",
            dateOfBirth: "1998-05-14",
            role: "user",
        });
    });

    it("postavlja auth cookie nakon uspešne registracije", async () => {
        const whereMock = vi.fn().mockResolvedValue([]);

        vi.mocked(db.select).mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: whereMock,
            }),
        } as any);

        vi.mocked(bcrypt.hash).mockResolvedValue(
            "hashed-password" as never
        );

        vi.mocked(db.insert).mockReturnValue({
            values: vi.fn().mockReturnValue({
                returning: vi
                    .fn()
                    .mockResolvedValue([createdUser]),
            }),
        } as any);

        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );

        const response = await POST(request);

        expect(signAuthToken).toHaveBeenCalled();

        expect(response.cookies.get(AUTH_COOKIE)?.value)
            .toBe("test-jwt-token");

        expect(cookieOpts).toHaveBeenCalled();
    });

    it("vraća 400 kada nisu popunjena sva obavezna polja", async () => {
        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify({
                    firstname: "Petar",
                    lastname: "Petrović",
                    email: "",
                    password: "Petar123!",
                    dateOfBirth: "1998-05-14",
                }),
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data).toEqual({
            error: "Sva polja su obavezna.",
        });

        expect(db.select).not.toHaveBeenCalled();
        expect(db.insert).not.toHaveBeenCalled();
    });

    it("vraća 409 kada korisnik sa email adresom već postoji", async () => {
        const whereMock = vi.fn().mockResolvedValue([
            {
                id: "existing-user",
            },
        ]);

        vi.mocked(db.select).mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: whereMock,
            }),
        } as any);

        const request = new Request(
            "http://localhost/api/auth/register",
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(409);

        expect(data).toEqual({
            error:
                "Korisnik sa ovim emailom već postoji.",
        });

        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(db.insert).not.toHaveBeenCalled();
    });
});