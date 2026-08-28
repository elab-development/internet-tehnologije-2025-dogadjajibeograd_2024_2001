import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, DELETE } from "./route";
import { db } from "@/db";

vi.mock("@/db", () => ({
    db: {
        select: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("/api/events/[id]", () => {
    const mockResult = {
        id: "event-123",
        name: "Hamlet",
        description: "Pozorišna predstava",
        eventDate: "2026-09-10",
        eventTime: "20:00",
        createdAt: new Date("2026-08-20T10:00:00.000Z"),

        eventTypeId: "type-1",
        eventTypeName: "predstava",

        locationId: "location-1",
        locationName: "Narodno pozorište",
        locationType: "pozoriste",
        locationAddress: "Francuska 3, Beograd",
        locationLatitude: 44.816944,
        locationLongitude: 20.4605,
        locationImageUrl: null,
        locationCreatedAt: new Date("2026-08-01T10:00:00.000Z"),
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("GET uspešno vraća događaj", async () => {
        const limitMock = vi.fn().mockResolvedValue([mockResult]);

        const whereMock = vi.fn(() => ({
            limit: limitMock,
        }));

        const secondInnerJoinMock = vi.fn(() => ({
            where: whereMock,
        }));

        const firstInnerJoinMock = vi.fn(() => ({
            innerJoin: secondInnerJoinMock,
        }));

        const fromMock = vi.fn(() => ({
            innerJoin: firstInnerJoinMock,
        }));

        vi.mocked(db.select).mockReturnValue({
            from: fromMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/events/event-123"
        );

        const response = await GET(request, {
            params: Promise.resolve({
                id: "event-123",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);

        expect(data).toEqual({
            id: "event-123",
            name: "Hamlet",
            description: "Pozorišna predstava",
            eventDate: "2026-09-10",
            eventTime: "20:00",
            createdAt: mockResult.createdAt.toISOString(),

            eventType: {
                id: "type-1",
                name: "predstava",
            },

            location: {
                id: "location-1",
                name: "Narodno pozorište",
                type: "pozoriste",
                address: "Francuska 3, Beograd",
                latitude: 44.816944,
                longitude: 20.4605,
                imageUrl: null,
                createdAt:
                    mockResult.locationCreatedAt.toISOString(),
            },
        });
    });

    it("uspešno briše događaj", async () => {
        const deletedEvent = {
            id: "event-123",
            name: "Hamlet",
            description: "Pozorišna predstava",
            eventDate: "2026-09-10",
            eventTime: "20:00",
        };

        const returningMock = vi
            .fn()
            .mockResolvedValue([deletedEvent]);

        const whereMock = vi.fn(() => ({
            returning: returningMock,
        }));

        vi.mocked(db.delete).mockReturnValue({
            where: whereMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/events/event-123",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "event-123",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);

        expect(data).toEqual({
            message: "Događaj je uspešno obrisan.",
            event: deletedEvent,
        });

        expect(db.delete).toHaveBeenCalled();
        expect(whereMock).toHaveBeenCalled();
        expect(returningMock).toHaveBeenCalled();
    });

    it("vraća 404 kada događaj ne postoji", async () => {
        const returningMock = vi
            .fn()
            .mockResolvedValue([]);

        const whereMock = vi.fn(() => ({
            returning: returningMock,
        }));

        vi.mocked(db.delete).mockReturnValue({
            where: whereMock,
        } as any);

        const request = new Request(
            "http://localhost:3000/api/events/nepostojeci-id",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "nepostojeci-id",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(404);

        expect(data).toEqual({
            error: "Događaj nije pronađen.",
        });

        expect(db.delete).toHaveBeenCalled();
        expect(whereMock).toHaveBeenCalled();
        expect(returningMock).toHaveBeenCalled();
    });

    it("vraća 500 kada dođe do greške pri brisanju događaja", async () => {
        const consoleErrorSpy = vi
            .spyOn(console, "error")
            .mockImplementation(() => { });

        vi.mocked(db.delete).mockImplementation(() => {
            throw new Error("Database error");
        });

        const request = new Request(
            "http://localhost:3000/api/events/event-123",
            {
                method: "DELETE",
            }
        );

        const response = await DELETE(request, {
            params: Promise.resolve({
                id: "event-123",
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(500);

        expect(data).toEqual({
            error: "Greška pri brisanju događaja.",
        });

        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
