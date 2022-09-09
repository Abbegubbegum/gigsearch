<script setup lang="ts">
import router from "@/router";
import type { User} from "@/types";
import { defineComponent } from "vue";
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, GeoPoint, doc } from "@firebase/firestore";
</script>

<template>
	<div class="content-container">
		<form class="register-form" @submit.prevent="registerUser">
			<label>
				<span>Name:</span>
				<input v-model="name" type="text" class="text-input" required />
			</label>
			<label>
				<span>Email:</span>
				<input
					v-model="email"
					type="email"
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
			<input type="submit" value="Register" />
			<button type="button" class="google-button" @click="googleSignIn">
				Sign In With Google
			</button>
		</form>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			name: "",
			email: "",
			password: "",
			users: [] as User[],
		};
	},
	methods: {
		registerUser() {
			createUserWithEmailAndPassword(getAuth(), this.email, this.password)
				.then((res) => {
					const user = getAuth().currentUser;
					if (user) {
						updateProfile(user, { displayName: this.name });
						return setDoc(doc(getFirestore(), "users", user.uid), {
							likes: 0,
							experienceRating: 0,
							locationCoord: new GeoPoint(0, 0),
							locationName: "",
							instruments: [],
							styles: [],
							about: "",
							name: this.name,
							email: this.email,
						} as User);
					}
				})
				.then(() => {
					router.push("/");
				})
				.catch((err) => {
					console.error(err);
				});
		},

		googleSignIn() {
			signInWithPopup(getAuth(), new GoogleAuthProvider())
				.then((res) => {
					const user = getAuth().currentUser;
					if (user) {
						updateProfile(user, { displayName: this.name });
						return setDoc(doc(getFirestore(), "users", user.uid), {
							likes: 0,
							experienceRating: 0,
							locationCoord: new GeoPoint(0, 0),
							locationName: "",
							instruments: [],
							styles: [],
							about: "",
							name: this.name,
							email: this.email,
						} as User);
					}
				})
				.then(() => {
					router.push("/");
				})
				.catch((err) => {
					console.error(err);
				});
		},
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
	padding: 1rem;
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
	padding: 0.3rem;
	font-size: 1rem;
	font-weight: bold;
	background-color: green;
	border: none;
	color: white;
}
</style>
