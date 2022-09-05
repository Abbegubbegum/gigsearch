<template>
	<div class="content-container">
		<div class="login-box">
			<div class="login-header">
				<h1>LOGIN</h1>
			</div>
			<form class="login-form" @submit.prevent="handleLogin">
				<label>
					Username:
					<input type="text" v-model="username" required />
				</label>

				<label>
					Password:
					<input type="password" v-model="password" required />
				</label>

				<input type="submit" value="Login" class="submit-btn" />
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getSessions, getUserFromSessionId, getUsers } from "@/main";
import router from "@/router";
import type { Session, User } from "@/types";

export default defineComponent({
	data() {
		return {
			username: "",
			password: "",
			users: [] as User[],
			sessions: [] as Session[],
		};
	},
	methods: {
		async handleLogin() {
			let user = this.users.find(
				(user) => user.username === this.username
			);
			if (!user) {
				console.log(
					"User with username '" + this.username + "' not found"
				);
				return;
			}

			if (user.password !== this.password) {
				console.log(
					"Incorrect password for user '" + user.username + "'"
				);
				return;
			}

			let session: Session = {
				sessionId: await this.hash((Math.random() * 100000).toString()),
				uId: user.id,
			};

			while (
				this.sessions.find(
					(active) => active.sessionId === session.sessionId
				)
			) {
				session = {
					sessionId: await this.hash(
						(Math.random() * 10000000000).toString()
					),
					uId: user.id,
				};
			}

			this.sessions.push(session);
			localStorage.setItem("sessionId", session.sessionId);
			router.push(`/profile/${session.uId}`);
			console.log(this.sessions);
		},

		async hash(val: string): Promise<string> {
			let data = new TextEncoder().encode(val);

			let hashBuffer = await crypto.subtle.digest("SHA-256", data);

			let hashArray = Array.from(new Uint8Array(hashBuffer));

			return this.toHexString(hashArray);
		},

		toHexString(byteArray: number[]): string {
			return Array.from(byteArray, function (byte) {
				return ("0" + (byte & 0xff).toString(16)).slice(-2);
			}).join("");
		},
	},
	async created() {
		this.sessions = await getSessions();
		this.users = await getUsers();
		let localSessionId = localStorage.getItem("sessionId");
		if (localSessionId) {
			let user = await getUserFromSessionId(localSessionId);

			if (!user) {
				localStorage.removeItem("sessionId");
				return;
			}

			router.push(`/profile/${user.id}`);
		}
	},
});
</script>

<style scoped>
.content-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.login-box {
	padding: 16px;
	border: 1px solid gray;
	box-shadow: 1px 1px 2px gray;
}

.login-header {
	text-align: center;
}

h1 {
	font-weight: 400;
}

.login-form {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}

input {
	margin: 1rem 0rem;
}

.submit-btn {
	padding: 5px 1rem;
	font-size: 1rem;
}
</style>
