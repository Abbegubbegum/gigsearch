<script setup lang="ts">
import router from "@/router";
import { defineComponent, capitalize } from "vue";
import type { Instrument, InstrumentWithID, User, UserWithID } from "@/types";
import EditPopup from "../components/EditPopup.vue";
import {
	collection,
	getFirestore,
	onSnapshot,
	getDoc,
	doc,
	DocumentReference,
	type DocumentData,
	setDoc,
	getDocs,
} from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
</script>

<template>
	<div class="main-container">
		<div class="content-container">
			<div class="profile-header">
				<div class="name-title">
					<h1>{{ capitalize(user.name) }}</h1>
				</div>
				<h2 class="location-text">
					<img
						src="@/assets/map-pin.svg"
						alt="Map pin icon"
						width="20"
					/>
					{{ user.locationName }}
				</h2>

				<button
					v-if="authedUser"
					type="button"
					@click="showPopup"
					class="push-right edit-btn"
				>
					<img src="@/assets/edit-icon.svg" />
					Edit Page
				</button>
			</div>
			<div>
				<a :href="'mailto:' + user.email">{{ user.email }}</a>
			</div>
			<div class="star-rating">
				Experience Rating
				<span class="rating-container">
					<StarRating
						:rating="user.experienceRating"
						:increment="0.01"
						:read-only="true"
						:show-rating="false"
						:star-size="30"
					/>
				</span>
			</div>
			<div class="item-container">
				<div>
					<h3>About</h3>
					<p>{{ user.about }}</p>
				</div>
			</div>
			<div class="item-container">
				<div>
					<h3>Instruments</h3>
					<ul>
						<li v-for="instrumentID in user.instruments">
							{{ capitalize(getInstrument(instrumentID).name) }}
						</li>
					</ul>
				</div>
				<div>
					<h3>Styles</h3>
					<ul>
						<li v-for="style in user.styles">
							{{ capitalize(style) }}
						</li>
					</ul>
				</div>
			</div>
			<footer>
				<button
					type="button"
					class="like-btn"
					:class="{ liked: liked, disabled: authedUser }"
					@click="onLikeButton"
				>
					{{ user.likes }} 👍
				</button>
			</footer>
		</div>
		<EditPopup
			:show="editPopupShow"
			@close="editPopupShow = false"
			@edit="handleEdit"
			:userId="user.id"
		/>
	</div>
</template>

<script lang="ts">
import StarRating from "vue-star-rating";

export default defineComponent({
	data() {
		return {
			user: {} as UserWithID,
			authedUser: false,
			editPopupShow: false,
			instruments: [] as InstrumentWithID[],
			userRef: {} as DocumentReference<DocumentData>,
			liked: false,
		};
	},
	methods: {
		capitalize,
		showPopup() {
			this.editPopupShow = true;
		},
		handleEdit(newUser: User) {
			this.user.name = newUser.name;
			this.user.locationName = newUser.locationName;
			this.user.locationCoord = newUser.locationCoord;
			this.user.about = newUser.about;
			this.user.styles = [...newUser.styles];
			this.user.instruments = [...newUser.instruments];
			this.user.experienceRating = newUser.experienceRating;

			let updateUser: User = {
				name: this.user.name,
				email: this.user.email,
				locationName: this.user.locationName,
				locationCoord: this.user.locationCoord,
				about: this.user.about,
				styles: this.user.styles,
				instruments: this.user.instruments,
				experienceRating: this.user.experienceRating,
				likes: this.user.likes,
				likedUsers: this.user.likedUsers,
				conversations: this.user.conversations,
			};

			setDoc(this.userRef, updateUser);

			this.editPopupShow = false;
		},

		getInstrument(instrumentID: string): Instrument {
			let instrument = this.instruments.find(
				(instrument) => instrument.id === instrumentID
			);

			return (
				instrument ||
				({ name: "Undefined", iconName: "" } as Instrument)
			);
		},

		async onLikeButton() {
			let currentUser = getAuth().currentUser;

			if (!currentUser || this.authedUser) return;

			this.user.likes += this.liked ? -1 : 1;
			this.liked = !this.liked;

			let snapshot = await getDoc(
				doc(getFirestore(), "users", currentUser.uid)
			);

			let data = snapshot.data();

			if (!data) return;

			let likedUsers: string[] = data.likedUsers;

			if (likedUsers.find((i) => i == this.user.id) !== undefined) {
				if (!this.liked) {
					likedUsers = likedUsers.filter(
						(userid) => userid !== this.user.id
					);
				}
			} else {
				if (this.liked) {
					likedUsers.push(this.user.id);
				}
			}

			setDoc(
				doc(getFirestore(), "users", currentUser.uid),
				{
					likedUsers: likedUsers,
				},
				{ merge: true }
			);

			setDoc(
				doc(getFirestore(), "users", this.user.id),
				{
					likes: this.user.likes,
				},
				{ merge: true }
			);
		},
	},
	async created() {
		// Create reference to user
		this.userRef = doc(
			getFirestore(),
			"users",
			this.$route.params.uid.toString()
		);

		//Get first data
		let userSnapshot = await getDoc(this.userRef).catch((err) => {
			console.error(err);
			router.push("/");
			return;
		});

		//If no user exists, redirect to 404
		if (!userSnapshot || !userSnapshot.exists()) {
			router.push("/404");
			return;
		}

		let data = userSnapshot.data();

		//Populate user field from data
		if (data) {
			this.user = {
				id: userSnapshot.id,
				name: data.name,
				email: data.email,
				likes: data.likes,
				experienceRating: data.experienceRating,
				locationName: data.locationName,
				locationCoord: data.locationCoord,
				instruments: data.instruments,
				styles: data.styles,
				about: data.about,
				likedUsers: data.likedUsers,
				conversations: data.conversations,
			};
		}

		// Get authed user
		let currentUser = getAuth().currentUser;

		//Set authedUser field accordingly
		if (currentUser?.uid === this.user.id) {
			this.authedUser = true;
			if (this.user.instruments.length === 0) {
				this.showPopup();
			}
		}

		//Get the authed users liked list and set the like button state accordingly
		if (currentUser) {
			let currentUserSnapshot = await getDoc(
				doc(getFirestore(), "users", currentUser.uid)
			);

			let data = currentUserSnapshot.data();

			if (data) {
				let likedUsers: string[] = data.likedUsers;

				if (likedUsers.find((i) => i == this.user.id) !== undefined) {
					this.liked = true;
				} else {
					this.liked = false;
				}
			}
		}

		onSnapshot(this.userRef, (snapshot) => {
			let data = snapshot.data();

			if (data) {
				this.user = {
					id: snapshot.id,
					name: data.name,
					email: data.email,
					likes: data.likes,
					experienceRating: data.experienceRating,
					locationName: data.locationName,
					locationCoord: data.locationCoord,
					instruments: data.instruments,
					styles: data.styles,
					about: data.about,
					likedUsers: data.likedUsers,
					conversations: data.conversations,
				};
			}
		});

		getDocs(collection(getFirestore(), "instruments")).then((snapshot) => {
			let newInstruments: InstrumentWithID[] = [];

			snapshot.forEach((doc) => {
				newInstruments.push({
					name: doc.data().name,
					iconName: doc.data().iconName,
					id: doc.id,
				});
			});

			this.instruments = [...newInstruments];
		});

		onAuthStateChanged(getAuth(), (authedUser) => {
			if (authedUser?.uid === this.user.id) {
				this.authedUser = true;
				return;
			}

			this.authedUser = false;
		});
	},
	components: { EditPopup, StarRating },
});
</script>

<style scoped>
.main-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: lightgray;
}

.content-container {
	display: grid;
	grid-template-rows: auto auto auto auto auto 1fr;
	height: 95%;
	width: clamp(13rem, 70%, 56rem);
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

.profile-header {
	display: flex;
	height: auto;
	align-items: flex-end;
	gap: 1rem;
	margin-bottom: 0.5rem;
}

.edit-btn {
	padding: 1rem;
	display: flex;
	align-items: center;
	gap: 0.3rem;
}

h1 {
	line-height: 2.5rem;
	font-size: 2.5rem;
	font-weight: bold;
}

a {
	font-size: 1.3rem;
	text-decoration: none;
	color: blue;
}

a:hover {
	text-decoration: underline;
}

h2 {
	color: grey;
	font-size: 1.6rem;
}

h3 {
	font-weight: bold;
}

ul {
	padding-left: 1rem;
}
.location-text {
	margin: 0;
	padding: 0;
	line-height: initial;
}

.push-right {
	margin-left: auto;
}

.item-container {
	display: flex;
	margin: 1rem 0;
	gap: 2rem;
}

.edit-btn {
	background-color: rgb(0, 140, 255);
	color: white;
	padding: 0.5rem;
	font-size: 1rem;
	font-weight: bold;
}

.edit-btn:hover {
	background-color: rgb(0, 118, 214);
}

.star-rating {
	margin: 1rem 0;
	color: gray;
	font-size: 1.3rem;
}

.like-btn {
	padding: 0.5rem;
	font-size: 1rem;
	background-color: lightgray;
}

.like-btn:hover {
	background-color: rgb(190, 188, 188);
}

.disabled:hover {
	cursor: not-allowed;
	background-color: lightgray;
}

.liked {
	background-color: rgb(0, 132, 255);
	color: white;
}

.liked:hover {
	background-color: rgb(0, 157, 255);
}
</style>
