<script setup lang="ts">
import router from "@/router";
import { defineComponent, capitalize } from "vue";
import type {
	Instrument,
	InstrumentWithID,
	User,
	UserWithID,
} from "@/types";
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
							src="@/assets/icons/map-pin.svg"
							alt="Map pin icon"
							width="17"
						/>
						{{ user.locationName }}
					</h2>
				</div>
				<button v-if="authedUser" type="button" @click="showPopup">
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
					<h3>Style</h3>
					<ul>
						<li v-for="style in user.styles">
							{{ capitalize(style) }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<EditPopup
			:show="editPopupShow"
			@close="editPopupShow = false"
			@edit="handleEdit"
			ref="editPopup"
		/>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			user: {} as UserWithID,
			authedUser: false,
			editPopupShow: false,
			instruments: [] as InstrumentWithID[],
			userRef: {} as DocumentReference<DocumentData>,
		};
	},
	methods: {
		capitalize,
		showPopup() {
			this.editPopupShow = true;

			if (this.$refs.editPopup) {
				let ref: any = this.$refs.editPopup;
				ref.setValues(this.user);
			}
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
	},
	async created() {
		this.userRef = doc(
			getFirestore(),
			"users",
			this.$route.params.uid.toString()
		);

		let snapshot = await getDoc(this.userRef).catch((err) => {
			console.error(err);
			router.push("/");
			return;
		});

		if (!snapshot || !snapshot.exists()) {
			router.push("/404");
			return;
		}

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
			};
		}

		if (getAuth().currentUser?.uid === snapshot.id) {
			this.authedUser = true;
		}

		const unsubUser = onSnapshot(this.userRef, (snapshot) => {
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
				};
			}
		});

		const unsubInstruments = onSnapshot(
			collection(getFirestore(), "instruments"),
			(snapshot) => {
				let newInstruments: InstrumentWithID[] = [];
				snapshot.forEach((doc) => {
					newInstruments.push({
						name: doc.data().name,
						iconName: doc.data().iconName,
						id: doc.id,
					});
				});
				this.instruments = [...newInstruments];
			}
		);

		const unsubAuth = onAuthStateChanged(getAuth(), (authedUser) => {
			if (authedUser?.uid === this.user.id) {
				this.authedUser = true;
				return;
			}

			this.authedUser = false;
		});
	},
	components: { EditPopup },
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
	height: 95%;
	width: clamp(13rem, 70%, 56rem);
	border: 1px solid grey;
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

button {
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
</style>
