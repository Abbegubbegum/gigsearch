import type { GeoPoint } from "@firebase/firestore";

export interface User {
	name: string;
	email: string;
	likes: number;
	experienceRating: number;
	locationName: string;
	locationCoord: GeoPoint;
	instruments: string[];
	styles: string[];
	about: string;
}

export interface UserWithID extends User {
	id: string;
}

export interface newUser {
	name: string;
	likes: number;
	experienceRating: number;
	locationName: string;
	locationCoord: GeoPoint;
	instruments: string[];
	styles: string[];
	about: string;
}

export interface Instrument {
	name: string;
	iconName: string;
}

export interface InstrumentWithID extends Instrument {
	id: string;
}

export interface FilterOptions {
	styles?: string[];
	locations?: string[];
	mainInstrumentOnly?: boolean;
}

export interface Session {
	sessionKey: string;
	id: number;
}
