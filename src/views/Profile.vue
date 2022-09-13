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
					<h2>{{ user.email }}</h2>
					<h2 class="location-text">
						<img
							src="@/assets/map-pin.svg"
							alt="Map pin icon"
							width="17"
						/>
						{{ user.locationName }}
					</h2>
				</div>

				<StarRating
					:rating="user.experienceRating"
					:increment="0.01"
					:read-only="true"
					:show-rating="false"
					:star-size="51.8"
				/>

				<button
					v-if="authedUser"
					type="button"
					@click="showPopup"
					class="push-right edit-btn"
				>
					Edit Page
				</button>
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
					:class="{ liked: liked }"
					@click="onLikeButton"
				>
					{{ user.likes }} Likes
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

			if (!currentUser || currentUser?.uid === this.user.id) return;

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
		this.userRef = doc(
			getFirestore(),
			"users",
			this.$route.params.uid.toString()
		);

		let userSnapshot = await getDoc(this.userRef).catch((err) => {
			console.error(err);
			router.push("/");
			return;
		});

		if (!userSnapshot || !userSnapshot.exists()) {
			router.push("/404");
			return;
		}

		let data = userSnapshot.data();
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
			};
		}

		let currentUser = getAuth().currentUser;

		if (currentUser?.uid === userSnapshot.id) {
			this.authedUser = true;
		}

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
					likedUsers: [],
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

		const unsubAuth = onAuthStateChanged(getAuth(), (authedUser) => {
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
	grid-template-rows: auto auto auto 1fr;
	height: 95%;
	width: clamp(13rem, 70%, 56rem);
	border: 1px solid grey;
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

.profile-header {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
}

.edit-btn {
	padding: 1rem;
}

h1 {
	font-size: 2.5rem;
	font-weight: bold;
}

h2 {
	color: grey;
	font-size: 1.3rem;
}

h3 {
	font-weight: bold;
}

ul {
	padding-left: 1rem;
}

.item-container {
	display: flex;
	margin: 1rem 0;
	gap: 2rem;
}

.location-text {
	margin: 0;
	padding: 0;
}

.push-right {
	margin-left: auto;
}

.like-btn {
	padding: 0.5rem;
	font-size: 1rem;
}

.liked {
	background-color: rgb(0, 132, 255);
	color: white;
}
</style>
