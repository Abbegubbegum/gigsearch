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
import TextField from "../components/TextField.vue";
import {
	collection,
	doc,
	GeoPoint,
	getFirestore,
	onSnapshot,
	setDoc,
} from "@firebase/firestore";
</script>

<template>
	<div class="content-container">
		<div class="login-box">
			<div class="login-header">
				<h1>LOGIN</h1>
			</div>
			<form class="login-form" @submit.prevent="loginUser">
				<TextField
					label="email"
					type="email"
					:value="email"
					@input="(e) => (email = e.target.value)"
					:error="emailError"
					:error-message="emailErrorMessage"
				/>

				<TextField
					label="password"
					type="password"
					:value="password"
					@input="(e) => (password = e.target.value)"
					:error="passwordError"
					:error-message="passwordErrorMessage"
				/>

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
			emailError: false,
			emailErrorMessage: "",
			password: "",
			passwordError: false,
			passwordErrorMessage: "",
			users: [] as User[],
			wrongAnimationTime: 500,
			userIDs: [] as string[],
		};
	},
	methods: {
		loginUser() {
			signInWithEmailAndPassword(getAuth(), this.email, this.password)
				.then((__data) => {
					router.push("/profile/" + getAuth().currentUser?.uid);
				})
				.catch((err) => {
					this.emailError = false;
					this.passwordError = false;
					switch (err.code) {
						case "auth/invalid-email":
							this.emailError = true;
							this.emailErrorMessage = "Not a valid email";
							break;
						case "auth/user-not-found":
							this.emailError = true;
							this.emailErrorMessage =
								"User with email not found";
							break;
						case "auth/wrong-password":
							this.passwordError = true;
							this.passwordErrorMessage =
								"Password does not match with email";
							break;
						default:
							this.emailError = true;
							this.emailErrorMessage = "";
							this.passwordError = true;
							this.passwordErrorMessage = "";
					}
				});
		},

		googleSignIn() {
			signInWithPopup(getAuth(), new GoogleAuthProvider())
				.then((__data) => {
					const user = getAuth().currentUser;
					console.log(user);
					console.log(this.userIDs);
					console.log(user?.displayName);
					if (this.userIDs.includes(user?.uid || "")) {
						router.push("/profile/" + user?.uid);
					} else if (user) {
						return setDoc(doc(getFirestore(), "users", user.uid), {
							likes: 0,
							experienceRating: 0,
							locationCoord: new GeoPoint(0, 0),
							locationName: "",
							instruments: [],
							styles: [],
							about: "",
							name: user.displayName || "",
							email: user.email,
							likedUsers: [],
						} as User);
					}
				})
				.then(() => {
					router.push("/profile/" + getAuth().currentUser?.uid);
				})
				.catch((err) => {
					alert("Error Signing in with Google");
					console.error(err);
				});
		},
	},
	async created() {
		let authedUser = getAuth().currentUser;

		if (authedUser) {
			router.push("/profile/" + authedUser.uid);
		}

		onSnapshot(collection(getFirestore(), "users"), (snapshot) => {
			let newUsers: string[] = [];
			snapshot.forEach((userSnapshot) => {
				let data = userSnapshot.data();
				if (data) {
					newUsers.push(userSnapshot.id);
				}
			});
			this.userIDs = [...newUsers];
		});
	},

	watch: {
		email(to, from) {
			this.passwordError = false;
			this.passwordErrorMessage = "";
			this.emailError = false;
			this.emailErrorMessage = "";
		},
		password(to, from) {
			this.emailError = false;
			this.emailErrorMessage = "";
			this.passwordError = false;
			this.passwordErrorMessage = "";
		},
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
	width: clamp(20rem, 40%, 40rem);
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

.submit-btn {
	padding: 0.3rem 1rem;
	margin: 1rem;
	background-color: rgb(1, 151, 1);
	color: white;
	align-self: center;
	font-size: 1.4rem;
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
	background-color: rgb(0, 132, 255);
	color: white;
	font-weight: bold;
	border-radius: 10px;
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
