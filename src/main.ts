import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import { reactive } from "vue";
import instruments from "./assets/instruments.json";
import type { User, Instrument, Session, newUser } from "./types";
import axios, { type AxiosResponse } from "axios";

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

export async function getUser(userId: number): Promise<User | undefined> {
	let res = await axios.get(store.apiURL + "users/" + userId).catch((err) => {
		return undefined;
	});

	if (res?.status === 200 || res?.status === 304) {
		return res.data;
	}

	return undefined;
}

export async function getInstruments(): Promise<Instrument[]> {
	return (await axios.get(store.apiURL + "instruments")).data;
}

export async function getSessions(): Promise<Session[]> {
	return (await axios.get(store.apiURL + "sessions")).data;
}

export async function getUserFromSessionKey(
	sessionKey: string
): Promise<User | undefined> {
	let sessions = await getSessions();
	let session = sessions.find((session) => session.sessionKey === sessionKey);

	if (!session) {
		console.log("Session not found: " + sessionKey);
		return undefined;
	}

	let user = await getUser(session.id);

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

	let duplicateSession = sessions.find((session) => session.id === userId);

	if (duplicateSession) {
		return duplicateSession.sessionKey;
	}

	let session: Session = {
		sessionKey: await hash((Math.random() * 100000).toString()),
		id: userId,
	};

	while (
		sessions.find((active) => active.sessionKey === session.sessionKey)
	) {
		session = {
			sessionKey: await hash((Math.random() * 10000000000).toString()),
			id: userId,
		};
	}

	await axios.post(store.apiURL + "sessions", session);

	return session.sessionKey;
}

export async function removeCurrentSession() {
	let sessionKey = localStorage.getItem("sessionKey");

	if (!sessionKey) return;

	let user = await getUserFromSessionKey(sessionKey);

	if (!user) {
		localStorage.removeItem("sessionKey");

		return;
	}

	await axios.delete(store.apiURL + "sessions/" + user.id);
	localStorage.removeItem("sessionKey");
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
