import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import { reactive } from "vue";
import users from "./assets/users.json";
import instruments from "./assets/instruments.json";
import sessions from "./assets/sessions.json";
import type { User, Instrument, Session } from "./types";

export const store = reactive({
	users: users as User[],
	instruments: instruments as Instrument[],
	sessions: sessions as Session[],
	loggedInUser: {} as User,
	getUserFromSessionId: (sessionId: string): User | undefined => {
		let session = sessions.find(
			(session) => session.sessionId === sessionId
		);

		if (!session) {
			console.log("Session not found: " + sessionId);
			return undefined;
		}

		let user = users.find((user) => user.id === session?.uId);

		if (!user) {
			console.log("User not found: " + session.uId);
			return undefined;
		}

		return user;
	},
});

const app = createApp(App);

app.use(router);

app.mount("#app");
