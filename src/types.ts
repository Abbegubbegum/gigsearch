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

export interface Instrument {
	id: number;
	name: string;
	iconName: string;
}