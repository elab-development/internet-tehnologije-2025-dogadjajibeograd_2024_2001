import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST, DELETE } from "./route";
import { db } from "@/db";
import { verifyAuthToken } from "@/lib/auth";

vi.mock("@/db", () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("@/lib/auth", () => ({
    AUTH_COOKIE: "auth_token",
    verifyAuthToken: vi.fn(),
}));

describe("Favorites /event/[id]", () => {
    beforeEach(() => {
        vi.resetAllMocks();

        vi.mocked(verifyAuthToken).mockReturnValue({
            sub: "user-1",
            email: "test@test.com",
            firstname: "Test",
            lastname: "User",
            dateOfBirth: "2000-01-01",
            role: "user",
        });
    });

    describe("GET", () => {
        it("vraća isFavorite true kada je događaj u omiljenim", async () => {
            const limitMock = vi.fn().mockResolvedValue([
                {
                    userId: "user-1",
                    eventId: "event-1",
                },
            ]);

            const whereMock = vi.fn().mockReturnValue({
                limit: limitMock,
            });

            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await GET(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                isFavorite: true,
            });

            expect(verifyAuthToken).toHaveBeenCalledWith(
                "valid-token"
            );
        });

        it("vraća isFavorite false kada događaj nije u omiljenim", async () => {
            const limitMock = vi.fn().mockResolvedValue([]);

            const whereMock = vi.fn().mockReturnValue({
                limit: limitMock,
            });

            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await GET(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual({
                isFavorite: false,
            });
        });

        it("vraća 401 kada korisnik nije prijavljen", async () => {
            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue(undefined),
                },
            } as any;

            const response = await GET(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data).toEqual({
                isFavorite: false,
            });

            expect(verifyAuthToken).not.toHaveBeenCalled();
        });

        it("vraća 500 kada dođe do greške", async () => {
            const consoleErrorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => { });

            vi.mocked(verifyAuthToken).mockImplementation(() => {
                throw new Error("JWT error");
            });

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "invalid-token",
                    }),
                },
            } as any;

            const response = await GET(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data).toEqual({
                isFavorite: false,
            });

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe("POST", () => {
        it("uspešno dodaje događaj u omiljene", async () => {
            const limitMock = vi.fn().mockResolvedValue([]);

            const whereMock = vi.fn().mockReturnValue({
                limit: limitMock,
            });

            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            const valuesMock = vi.fn().mockResolvedValue(undefined);

            vi.mocked(db.insert).mockReturnValue({
                values: valuesMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await POST(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(201);

            expect(data).toEqual({
                message: "Događaj je dodat u omiljeno.",
                isFavorite: true,
            });

            expect(valuesMock).toHaveBeenCalledWith({
                userId: "user-1",
                eventId: "event-1",
            });
        });

        it("vraća 409 ako je događaj već u omiljenim", async () => {
            const limitMock = vi.fn().mockResolvedValue([
                {
                    userId: "user-1",
                    eventId: "event-1",
                },
            ]);

            const whereMock = vi.fn().mockReturnValue({
                limit: limitMock,
            });

            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await POST(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(409);

            expect(data).toEqual({
                message: "Događaj je već dodat u omiljeno.",
                isFavorite: true,
            });

            expect(db.insert).not.toHaveBeenCalled();
        });

        it("vraća 401 kada korisnik nije prijavljen", async () => {
            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue(undefined),
                },
            } as any;

            const response = await POST(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(401);

            expect(data).toEqual({
                message: "Korisnik nije prijavljen.",
            });

            expect(db.insert).not.toHaveBeenCalled();
        });

        it("vraća 500 kada dodavanje u bazu ne uspe", async () => {
            const consoleErrorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => { });

            const limitMock = vi.fn().mockResolvedValue([]);

            const whereMock = vi.fn().mockReturnValue({
                limit: limitMock,
            });

            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            const valuesMock = vi
                .fn()
                .mockRejectedValue(
                    new Error("Database error")
                );

            vi.mocked(db.insert).mockReturnValue({
                values: valuesMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await POST(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(500);

            expect(data).toEqual({
                message:
                    "Greška pri dodavanju događaja u omiljeno.",
                error: "Database error",
            });

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });

    describe("DELETE", () => {
        it("uspešno uklanja događaj iz omiljenih", async () => {
            const returningMock = vi.fn().mockResolvedValue([
                {
                    userId: "user-1",
                    eventId: "event-1",
                },
            ]);

            const whereMock = vi.fn().mockReturnValue({
                returning: returningMock,
            });

            vi.mocked(db.delete).mockReturnValue({
                where: whereMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await DELETE(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(200);

            expect(data).toEqual({
                message:
                    "Događaj je uklonjen iz omiljenih.",
                isFavorite: false,
            });
        });

        it("vraća 404 kada događaj nije u omiljenim", async () => {
            const returningMock = vi
                .fn()
                .mockResolvedValue([]);

            const whereMock = vi.fn().mockReturnValue({
                returning: returningMock,
            });

            vi.mocked(db.delete).mockReturnValue({
                where: whereMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await DELETE(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(404);

            expect(data).toEqual({
                message:
                    "Događaj nije pronađen u omiljenim.",
                isFavorite: false,
            });
        });

        it("vraća 401 kada korisnik nije prijavljen", async () => {
            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue(undefined),
                },
            } as any;

            const response = await DELETE(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(401);

            expect(data).toEqual({
                message: "Korisnik nije prijavljen.",
            });

            expect(db.delete).not.toHaveBeenCalled();
        });

        it("vraća 500 kada brisanje iz baze ne uspe", async () => {
            const consoleErrorSpy = vi
                .spyOn(console, "error")
                .mockImplementation(() => { });

            const whereMock = vi.fn().mockReturnValue({
                returning: vi.fn().mockRejectedValue(
                    new Error("Database error")
                ),
            });

            vi.mocked(db.delete).mockReturnValue({
                where: whereMock,
            } as any);

            const request = {
                cookies: {
                    get: vi.fn().mockReturnValue({
                        value: "valid-token",
                    }),
                },
            } as any;

            const response = await DELETE(request, {
                params: Promise.resolve({
                    id: "event-1",
                }),
            });

            const data = await response.json();

            expect(response.status).toBe(500);

            expect(data).toEqual({
                message:
                    "Greška pri uklanjanju događaja iz omiljenih.",
                error: "Database error",
            });

            expect(consoleErrorSpy).toHaveBeenCalled();

            consoleErrorSpy.mockRestore();
        });
    });
});