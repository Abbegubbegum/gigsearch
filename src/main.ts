import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "./assets/base.css";
import { reactive } from "vue";
import users from "./assets/users.json";
import instruments from "./assets/instruments.json";
import type { User, Instrument } from "./types";

export const data = reactive({
	users: users as User[],
	instruments: instruments as Instrument[],
});

const app = createApp(App);

app.use(router);

app.mount("#app");
