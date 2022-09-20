<script setup lang="ts">
import router from "@/router";
import type { User } from "@/types";
import { defineComponent } from "vue";
import {
	createUserWithEmailAndPassword,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import {
	getFirestore,
	setDoc,
	GeoPoint,
	doc,
	collection,
	onSnapshot,
} from "@firebase/firestore";
import TextField from "../components/TextField.vue";
</script>

<template>
	<div class="content-container">
		<form class="register-form" @submit.prevent="registerUser">
			<h1>Register</h1>
			<TextField
				label="name"
				type="text"
				:value="name"
				@input="(e) => (name = e.target.value)"
				class="text-field"
			/>

			<TextField
				label="email"
				type="email"
				:value="email"
				@input="(e) => (email = e.target.value)"
				class="text-field"
			/>

			<TextField
				label="password"
				type="password"
				:value="password"
				@input="(e) => (password = e.target.value)"
				class="text-field"
			/>
			<input type="submit" value="Register" />
			<button type="button" class="google-btn" @click="googleSignIn">
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
			userIDs: [] as string[],
		};
	},
	methods: {
		registerUser() {
			createUserWithEmailAndPassword(getAuth(), this.email, this.password)
				.then((res) => {
					const user = getAuth().currentUser;
					if (this.userIDs.includes(user?.uid || "")) {
						router.push("/profile/" + getAuth().currentUser?.uid);
					} else if (user) {
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
							likedUsers: [],
						} as User);
					}
				})
				.then(() => {
					router.push("/profile/" + getAuth().currentUser?.uid);
				})
				.catch((err) => {
					alert("Failed to register user");
					console.error(err);
				});
		},

		googleSignIn() {
			signInWithPopup(getAuth(), new GoogleAuthProvider())
				.then((res) => {
					const user = getAuth().currentUser;
					if (this.userIDs.includes(user?.uid || "")) {
						router.push("/profile/" + getAuth().currentUser?.uid);
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

	created() {
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
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	border: 1px solid gray;
	padding: 1rem;
	box-shadow: 10px 10px 20px gray;
	width: clamp(20rem, 40%, 40rem);
	border-radius: 20px;
}

input[type="submit"] {
	padding: 0.3rem;
	font-size: 1.5rem;
	font-weight: bold;
	background-color: green;
	border: none;
	color: white;
	width: 100%;
}

.google-btn {
	padding: 0.3rem 1rem;
	margin: 0 10rem;
	background-color: rgb(0, 132, 255);
	color: white;
	font-size: 1rem;
	font-weight: bold;
	align-self: center;
}
</style>
