import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import { reactive } from "vue";
import instruments from "./assets/instruments.json";
import type { User, Instrument, Session } from "./types";
import axios from "axios";

export const store = reactive({
	apiURL: "http://localhost:3001/",
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

	let user = users.find((user) => user.id === session?.uId);

	if (!user) {
		console.log("User not found: " + session.uId);
		return undefined;
	}

	return user;
}
