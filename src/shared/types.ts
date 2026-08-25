export interface FullEventLocationDto {
    id: string;
    name: string;
    type:
        | "pozoriste"
        | "bioskop"
        | "koncertna_dvorana"
        | "centar_za_kulturu"
        | "drugo";
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string | null;
    createdAt: Date;
}

export interface FullEventTypeDto {
    id: string;
    name: string;
}

export interface FullEventDto {
    id: string;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    createdAt: Date;

    eventType: {
        id: string;
        name: string;
    };

    location: {
        id: string;
        name: string;
        type:
            | "pozoriste"
            | "bioskop"
            | "koncertna_dvorana"
            | "centar_za_kulturu"
            | "drugo";
        address: string;
        latitude: number;
        longitude: number;
        imageUrl: string | null;
        createdAt: Date;
    };
}

export interface FullFavoriteEventDto {
    userId: string;
    eventId: string;
}

export interface UpcomingEventDto {
    id: string;
    name: string;
    eventDate: string;
    locationName: string;
}