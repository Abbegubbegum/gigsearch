export interface User {
	id: string;
	name: string;
	likes: number;
	experienceRating: number;
	location: string;
	instruments: Instrument[];
	styles: string[];
	about: string;
}

export interface Instrument {
	id: string;
	name: string;
	iconName: string;
}
