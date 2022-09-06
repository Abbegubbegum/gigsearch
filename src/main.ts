import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import { reactive } from "vue";
import instruments from "./assets/instruments.json";
import type { User, Instrument, Session, newUser } from "./types";
import axios from "axios";

export const store = reactive({
	apiURL: "http://localhost:3000/",
	instruments: instruments as Instrument[],
	loggedInUser: {} as User,
});

const app = createApp(App);

app.use(router);

app.mount("#app");

export async function getUsers(): Promise<User[]> {
	return (await axios.get(store.apiURL + "users")).data;
}

export async function getInstruments(): Promise<Instrument[]> {
	return (await axios.get(store.apiURL + "instruments")).data;
}

export async function getSessions(): Promise<Session[]> {
	return (await axios.get(store.apiURL + "sessions")).data;
}

export async function getUserFromSessionId(
	sessionId: string
): Promise<User | undefined> {
	let sessions = await getSessions();
	let session = sessions.find((session) => session.sessionId === sessionId);

	if (!session) {
		console.log("Session not found: " + sessionId);
		return undefined;
	}

	let users = await getUsers();

	let user = users.find((user) => user.id === session?.id);

	if (!user) {
		console.log("User not found: " + session.id);
		return undefined;
	}

	return user;
}

export async function addUser(user: newUser) {
	let res = await axios.post(store.apiURL + "users", user);
}

export async function createSession(userId: number): Promise<string> {
	let sessions = await getSessions();
	let session: Session = {
		sessionId: await hash((Math.random() * 100000).toString()),
		id: userId,
	};

	while (sessions.find((active) => active.sessionId === session.sessionId)) {
		session = {
			sessionId: await hash((Math.random() * 10000000000).toString()),
			id: userId,
		};
	}

	await axios.post(store.apiURL + "sessions", session);

	return session.sessionId;
}

export async function hash(val: string): Promise<string> {
	let data = new TextEncoder().encode(val);

	let hashBuffer = await crypto.subtle.digest("SHA-256", data);

	let hashArray = Array.from(new Uint8Array(hashBuffer));

	return toHexString(hashArray);
}

function toHexString(byteArray: number[]): string {
	return Array.from(byteArray, function (byte) {
		return ("0" + (byte & 0xff).toString(16)).slice(-2);
	}).join("");
}
