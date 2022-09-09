import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/base.css";
import { reactive } from "vue";
import instruments from "./assets/instruments.json";
import type { User, Instrument, Session, newUser } from "./types";
import axios, { type AxiosResponse } from "axios";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
	apiKey: "AIzaSyDBZXix-BZGLOcRYvl8e7sc46ZTDNyM_ck",
	authDomain: "gigsearch-b3ae7.firebaseapp.com",
	projectId: "gigsearch-b3ae7",
	storageBucket: "gigsearch-b3ae7.appspot.com",
	messagingSenderId: "309932126295",
	appId: "1:309932126295:web:d2795c74da1aef79557312",
	measurementId: "G-LP1N9488PN",
};

initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseapp);

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
	await axios.post(store.apiURL + "users", user);
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
