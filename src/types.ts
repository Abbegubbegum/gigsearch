export interface Musician {
	id: string;
	name: string;
	rating: number;
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
