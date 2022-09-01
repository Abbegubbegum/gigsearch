export interface User {
	id: string;
	name: string;
	likes: number;
	experienceRating: number;
	location: string;
	instruments: number[];
	styles: string[];
	about: string;
}

interface Thing {
	id: string;
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
