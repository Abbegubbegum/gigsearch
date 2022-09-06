export interface User {
	id: number;
	username: string;
	password: string;
	name: string;
	likes: number;
	experienceRating: number;
	location: string;
	instruments: number[];
	styles: string[];
	about: string;
}

export interface newUser {
	username: string;
	password: string;
	name: string;
	likes: number;
	experienceRating: number;
	location: string;
	instruments: number[];
	styles: string[];
	about: string;
}

export interface Instrument {
	id: number;
	name: string;
	iconName: string;
}

export interface FilterOptions {
	styles?: string[];
	locations?: string[];
	mainInstrumentOnly?: boolean;
}

export interface Session {
	sessionId: string;
	id: number;
}
