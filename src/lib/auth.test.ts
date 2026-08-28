import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-key";
});

describe("Auth JWT", () => {
    it("kreira i verifikuje validan JWT token", async () => {
        const {
            signAuthToken,
            verifyAuthToken,
        } = await import("./auth");

        const user = {
            sub: "user-123",
            email: "test@example.com",
            firstname: "Petar",
            lastname: "Petrović",
            dateOfBirth: "1998-05-14",
            role: "user" as const,
        };

        const token = signAuthToken(user);

        expect(token).toBeDefined();
        expect(typeof token).toBe("string");

        const decoded = verifyAuthToken(token);

        expect(decoded).toEqual(user);
    });

    it("verifikuje token administratora", async () => {
        const {
            signAuthToken,
            verifyAuthToken,
        } = await import("./auth");

        const admin = {
            sub: "admin-123",
            email: "admin@example.com",
            firstname: "Marko",
            lastname: "Marković",
            role: "admin" as const,
        };

        const token = signAuthToken(admin);

        const decoded = verifyAuthToken(token);

        expect(decoded).toEqual({
            sub: "admin-123",
            email: "admin@example.com",
            firstname: "Marko",
            lastname: "Marković",
            dateOfBirth: undefined,
            role: "admin",
        });
    });

    it("odbacuje neispravan JWT token", async () => {
        const { verifyAuthToken } =
            await import("./auth");

        expect(() =>
            verifyAuthToken("invalid-token")
        ).toThrow();
    });

    it("odbacuje token potpisan drugim secret ključem", async () => {
        const jwt = await import("jsonwebtoken");

        const { verifyAuthToken } =
            await import("./auth");

        const token = jwt.sign(
            {
                sub: "user-123",
                email: "test@example.com",
                role: "user",
            },
            "wrong-secret",
            {
                algorithm: "HS256",
            }
        );

        expect(() =>
            verifyAuthToken(token)
        ).toThrow();
    });

    it("odbacuje token bez obaveznog sub polja", async () => {
        const jwt = await import("jsonwebtoken");

        const { verifyAuthToken } =
            await import("./auth");

        const token = jwt.sign(
            {
                email: "test@example.com",
                role: "user",
            },
            "test-secret-key",
            {
                algorithm: "HS256",
            }
        );

        expect(() =>
            verifyAuthToken(token)
        ).toThrow("Invalid token");
    });

    it("odbacuje token bez email polja", async () => {
        const jwt = await import("jsonwebtoken");

        const { verifyAuthToken } =
            await import("./auth");

        const token = jwt.sign(
            {
                sub: "user-123",
                role: "user",
            },
            "test-secret-key",
            {
                algorithm: "HS256",
            }
        );

        expect(() =>
            verifyAuthToken(token)
        ).toThrow("Invalid token");
    });

    it("odbacuje token sa neispravnom korisničkom ulogom", async () => {
        const jwt = await import("jsonwebtoken");

        const { verifyAuthToken } =
            await import("./auth");

        const token = jwt.sign(
            {
                sub: "user-123",
                email: "test@example.com",
                role: "superadmin",
            },
            "test-secret-key",
            {
                algorithm: "HS256",
            }
        );

        expect(() =>
            verifyAuthToken(token)
        ).toThrow("Invalid token");
    });

    it("odbacuje istekao JWT token", async () => {
        const jwt = await import("jsonwebtoken");

        const { verifyAuthToken } =
            await import("./auth");

        const token = jwt.sign(
            {
                sub: "user-123",
                email: "test@example.com",
                role: "user",
            },
            "test-secret-key",
            {
                algorithm: "HS256",
                expiresIn: -1,
            }
        );

        expect(() =>
            verifyAuthToken(token)
        ).toThrow();
    });
});

describe("Auth cookie", () => {
    it("vraća ispravne cookie opcije", async () => {
        const { cookieOpts } =
            await import("./auth");

        const options = cookieOpts();

        expect(options.httpOnly).toBe(true);
        expect(options.sameSite).toBe("lax");
        expect(options.path).toBe("/");
        expect(options.maxAge).toBe(
            60 * 60 * 24 * 7
        );
    });

    it("cookie traje 7 dana", async () => {
        const { cookieOpts } =
            await import("./auth");

        const options = cookieOpts();

        expect(options.maxAge).toBe(604800);
    });
});