<template>
	<div class="content-container">
		<form class="register-form" @submit.prevent="handleRegister">
			<label>
				<span>Full Name:</span>
				<input v-model="name" type="text" class="text-input" required />
			</label>
			<label>
				<span>Username:</span>
				<input
					v-model="username"
					type="text"
					class="text-input"
					required
				/>
			</label>
			<label>
				<span>Password:</span>
				<input
					v-model="password"
					type="password"
					class="text-input"
					required
				/>
			</label>
			<label>
				<span>Confirm Password:</span>
				<input
					v-model="passwordConfirm"
					type="password"
					class="text-input"
					required
				/>
			</label>
			<input type="submit" value="Register" />
		</form>
	</div>
</template>

<script lang="ts">
import { addUser, createSession, getSessions, getUsers } from "@/main";
import router from "@/router";
import type { User, Session, newUser } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			name: "",
			username: "",
			password: "",
			passwordConfirm: "",
			users: [] as User[],
			sessions: [] as Session[],
		};
	},
	methods: {
		async handleRegister() {
			let user: newUser;

			if (this.users.find((user) => user.username === this.username)) {
				console.log("Username already registered " + this.username);
				return;
			}

			if (this.password !== this.passwordConfirm) {
				console.log("Passwords do not match");
				return;
			}

			user = {
				username: this.username,
				password: this.password,
				name: this.name,
				likes: 0,
				experienceRating: 0,
				location: "",
				instruments: [],
				styles: [],
				about: "",
			};

			await addUser(user);

			this.users = await getUsers();

			let userId = this.users.find(
				(user) => user.username === this.username
			)?.id;

			if (userId) {
				let sessionId = await createSession(userId);
				localStorage.setItem("sessionId", sessionId);
				router.push("/profile/" + userId );
			} else {
				console.error("Username registered but not found");
				console.log(this.users, this.username);
			}
		},
	},
	async created() {
		this.users = await getUsers();
		this.sessions = await getSessions();
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
.register-form {
	display: grid;
	grid-auto-flow: row;
	align-content: center;
	gap: 1rem;
	border: 1px solid gray;
	padding: 16px;
}

label {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
}

.text-input {
	padding: 0.5rem;
}

input[type="submit"] {
	padding: 4px;
	font-size: 1rem;
	font-weight: bold;
	background-color: green;
	border: none;
	color: white;
}
</style>
