<template>
	<div class="content-container">
		<div class="login-box">
			<div class="login-header">
				<h1>LOGIN</h1>
			</div>
			<form class="login-form" @submit.prevent="handleLogin">
				<label>
					Username:
					<input
						type="text"
						v-model="username"
						:class="{ wronganimation: wrongUsername }"
						required
					/>
				</label>

				<label>
					Password:
					<input
						type="password"
						v-model="password"
						:class="{ wronganimation: wrongPassword }"
						required
					/>
				</label>

				<input type="submit" value="Login" class="submit-btn" />
			</form>
		</div>
		<button
			type="button"
			class="register-btn"
			@click="$router.push('/register')"
		>
			Register
		</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
	createSession,
	getSessions,
	getUserFromSessionKey,
	getUsers,
	hash,
} from "@/main";
import router from "@/router";
import type { Session, User } from "@/types";

export default defineComponent({
	data() {
		return {
			username: "",
			password: "",
			users: [] as User[],
			sessions: [] as Session[],
			wrongAnimationTime: 500,
			wrongUsername: false,
			wrongPassword: false,
		};
	},
	methods: {
		async handleLogin() {
			let user = this.users.find(
				(user) => user.username === this.username
			);
			if (!user) {
				this.wrongUsername = true;
				setTimeout(() => {
					this.wrongUsername = false;
				}, this.wrongAnimationTime);
				return;
			}

			if (user.password !== this.password) {
				this.wrongPassword = true;
				setTimeout(() => {
					this.wrongPassword = false;
				}, this.wrongAnimationTime);
				return;
			}

			let sessionKey = await createSession(user.id);
			localStorage.setItem("sessionKey", sessionKey);
			this.$emit("updateLogin");

			router.push(`/profile/${user.id}`);
		},
	},
	async created() {
		this.sessions = await getSessions();
		this.users = await getUsers();
		let localsessionKey = localStorage.getItem("sessionKey");
		if (!localsessionKey) return;

		let user = await getUserFromSessionKey(localsessionKey);

		if (!user) {
			localStorage.removeItem("sessionKey");
			return;
		}

		router.push(`/profile/${user.id}`);
	},
});
</script>

<style scoped>
.content-container {
	height: 100%;
	display: flex;
	flex-direction: column;
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

.register-btn {
	margin: 1rem;
	padding: 5px 1rem;
	font-size: 1rem;
}

.wronganimation {
	border-color: red;
	animation: shake 0.2s;
}

@keyframes shake {
	0% {
		transform: translate(3px, 0px);
	}
	25% {
		transform: translate(-3px, 0px);
	}
	50% {
		transform: translate(3px, 0px);
	}
	75% {
		transform: translate(-3px, 0px);
	}
	100% {
		transform: translate(0px, 0px);
	}
}
</style>
