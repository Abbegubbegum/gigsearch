import type {
	CollectionReference,
	DocumentData,
	GeoPoint,
	Timestamp,
} from "@firebase/firestore";

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
	likedUsers: string[];
}

export interface UserWithID extends User {
	id: string;
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
	mainInstrumentOnly?: boolean;
}

export interface Conversation {
	members: string[];
}

export interface ConversationWithNames extends Conversation {
	id: string;
	memberNames: string[];
	messageRef: CollectionReference<DocumentData>;
}

export interface Message {
	sender: string;
	text: string;
	timestamp: Timestamp;
}

export interface MessageWithName extends Message {
	senderName: string;
}
