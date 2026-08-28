import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import { db } from "@/db";

vi.mock("@/db", () => ({
    db: {
        select: vi.fn(),
    },
}));

describe("GET /api/eventLocations/[id]", () => {
    const mockLocation = {
        id: "location-123",
        name: "Narodno pozorište",
        type: "pozoriste",
        address: "Francuska 3, Beograd",
        latitude: 44.816944,
        longitude: 20.4605,
        imageUrl: null,
        createdAt: new Date("2026-08-01T10:00:00.000Z"),
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("uspešno vraća mesto događaja", async () => {
        const limitMock = vi.fn().mockResolvedValue([mockLocation]);

        const whereMock = vi.fn(() => ({
            limit: limitMock,
        }));

        const fromMock = vi.fn(() => ({
            where: whereMock,
        }));

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/eventLocations/location-123"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                id: "location-123",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);

        expect(data).toEqual({
            ...mockLocation,
            createdAt: mockLocation.createdAt.toISOString(),
        });
    });

    it("vraća 404 kada mesto ne postoji", async () => {
        const limitMock = vi.fn().mockResolvedValue([]);

        const whereMock = vi.fn(() => ({
            limit: limitMock,
        }));

        const fromMock = vi.fn(() => ({
            where: whereMock,
        }));

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/eventLocations/nepostojeci-id"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                id: "nepostojeci-id",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(404);

        expect(data).toEqual({
            message: "Mesto nije pronađeno.",
        });
    });
});