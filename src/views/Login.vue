<script setup lang="ts">
import { defineComponent } from "vue";
import router from "@/router";
import type { User } from "@/types";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
} from "@firebase/auth";
</script>

<template>
	<div class="content-container">
		<div class="login-box">
			<div class="login-header">
				<h1>LOGIN</h1>
			</div>
			<form class="login-form" @submit.prevent="loginUser">
				<label>
					Email:
					<input
						type="email"
						v-model="email"
						:class="{ wronganimation: wrongEmail }"
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
				<button type="button" class="google-btn" @click="googleSignIn">
					Sign in with Google
				</button>
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
export default defineComponent({
	data() {
		return {
			email: "",
			password: "",
			users: [] as User[],
			wrongAnimationTime: 500,
			wrongEmail: false,
			wrongPassword: false,
		};
	},
	methods: {
		loginUser() {
			signInWithEmailAndPassword(getAuth(), this.email, this.password)
				.then((__data) => {
					console.log("Logged in successfully");
					router.push("/");
				})
				.catch((err) => {
					switch (err.code) {
						case "auth/invalid-email":
							this.wrongEmail = true;
							setTimeout(() => {
								this.wrongEmail = false;
							}, this.wrongAnimationTime);
							break;
						case "auth/user-not-found":
							this.wrongEmail = true;
							setTimeout(() => {
								this.wrongEmail = false;
							}, this.wrongAnimationTime);
							break;
						case "auth/wrong-password":
							this.wrongPassword = true;
							setTimeout(() => {
								this.wrongPassword = false;
							}, this.wrongAnimationTime);
							break;
						default:
							this.wrongEmail = true;
							this.wrongPassword = true;
							setTimeout(() => {
								this.wrongEmail = false;
								this.wrongPassword = false;
							}, this.wrongAnimationTime);
							break;
					}
				});
		},

		googleSignIn() {
			signInWithPopup(getAuth(), new GoogleAuthProvider())
				.then((__data) => {
					console.log("Logged in successfully");
					router.push("/");
				})
				.catch((err) => {
					switch (err.code) {
						case "auth/invalid-email":
							this.wrongEmail = true;
							setTimeout(() => {
								this.wrongEmail = false;
							}, this.wrongAnimationTime);
							break;
						case "auth/user-not-found":
							this.wrongEmail = true;
							setTimeout(() => {
								this.wrongEmail = false;
							}, this.wrongAnimationTime);
							break;
						case "auth/wrong-password":
							this.wrongPassword = true;
							setTimeout(() => {
								this.wrongPassword = false;
							}, this.wrongAnimationTime);
							break;
						default:
							this.wrongEmail = true;
							this.wrongPassword = true;
							setTimeout(() => {
								this.wrongEmail = false;
								this.wrongPassword = false;
							}, this.wrongAnimationTime);
							break;
					}
				});
		},
	},
	async created() {
		let authedUser = getAuth().currentUser;

		if (authedUser) {
			router.push("/profile/" + authedUser.uid);
		}
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
	padding: 1rem;
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
	align-items: flex-start;
}

label {
	width: 100%;
}
input[type="password"],
input[type="email"] {
	margin: 0rem 0rem 1rem 0rem;
	width: 100%;
}

.submit-btn {
	padding: 0.3rem 1rem;
	font-size: 1rem;
	background-color: rgb(1, 151, 1);
	color: white;
	align-self: center;
	font-size: 1rem;
	font-weight: bold;
	width: 100%;
}

.google-btn {
	padding: 0.3rem 1rem;
	background-color: rgb(0, 132, 255);
	color: white;
	font-size: 1rem;
	font-weight: bold;
	align-self: center;
}

.register-btn {
	margin: 1rem;
	padding: 0.3rem 1rem;
	font-size: 1rem;
}

.wronganimation {
	border-color: red;
	animation: shake 0.2s;
}

@keyframes shake {
	0% {
		transform: translate(0.3rem, 0);
	}
	25% {
		transform: translate(-0.3rem, 0);
	}
	50% {
		transform: translate(0.3rem, 0);
	}
	75% {
		transform: translate(-0.3rem, 0);
	}
	100% {
		transform: translate(0, 0);
	}
}
</style>
