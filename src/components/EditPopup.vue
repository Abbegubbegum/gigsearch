<script setup lang="ts">
import { decodeGeopoint, encodeLocation } from "@/main";
import type { Instrument, InstrumentWithID, User } from "@/types";
import { getAuth, updateProfile } from "@firebase/auth";
import {
	onSnapshot,
	collection,
	getFirestore,
	GeoPoint,
	getDocs,
	doc,
	getDoc,
} from "@firebase/firestore";
import { defineComponent } from "vue";
</script>

<template>
	<Transition name="modal">
		<div v-if="show" class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<form @submit.prevent class="full-form">
						<label>
							<span>Name</span>
							<input type="text" v-model="name" required />
						</label>
						<div class="location-container">
							<label>
								<span>City</span>
								<input
									type="text"
									v-model="city"
									placeholder="Stockholm"
									required
								/>
							</label>
							<label>
								<span>Country</span>
								<input
									type="text"
									v-model="country"
									placeholder="Sweden"
									required
								/>
							</label>
							<button class="location-btn" @click="getLocation">
								Get My Location
							</button>
						</div>
						<label>
							<span>About</span>
							<textarea
								cols="40"
								rows="5"
								v-model="about"
							></textarea>
						</label>
						<label>
							<span>Experience Rating: </span>
							<input
								type="range"
								min="0"
								max="5"
								step="0.5"
								v-model="experienceRating"
								@mousedown="showTooltip = true"
								@mouseup="showTooltip = false"
							/>
							<div
								class="tooltip"
								v-if="showTooltip"
								:style="{ top: tooltipTop, left: tooltipLeft }"
							>
								{{ experienceRating }}
							</div>
						</label>

						<form @submit.prevent="handleStyleSubmit">
							<label>
								<span>Styles</span>
								<input type="text" v-model="styleInput" />
							</label>
							<input type="submit" value="+" class="add-btn" />
						</form>
						<ul>
							<li
								v-for="style in styles"
								@click="removeStyle(style)"
							>
								{{ style }}
								<button
									type="button"
									class="rmv-btn"
									@click="removeStyle(style)"
								>
									X
								</button>
							</li>
						</ul>

						<form @submit.prevent="handleInstrumentSubmit">
							<label>
								<span>Instruments</span>
								<input type="text" v-model="instrumentInput" />
							</label>
							<input type="submit" value="+" class="add-btn" />
						</form>
						<ul>
							<li
								v-for="instrument in instruments"
								@click="removeInstrument(instrument)"
							>
								{{ instrument.name }}
								<button
									type="button"
									class="rmv-btn"
									@click="removeInstrument(instrument)"
								>
									X
								</button>
							</li>
						</ul>
						<div class="button-container">
							<input
								type="submit"
								value="Save"
								@click="handleFullSubmit"
								class="submit-btn"
							/>
							<button class="close-btn" @click="$emit('close')">
								Close
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			user: {} as User,
			name: "",
			locationName: "",
			locationCoords: {} as GeoPoint,
			city: "",
			country: "",
			experienceRating: 0,
			instrumentInput: "",
			instruments: [] as InstrumentWithID[],
			styleInput: "",
			styles: [] as string[],
			about: "",
			allInstruments: [] as InstrumentWithID[],
			showTooltip: false,
			tooltipTop: "0",
			tooltipLeft: "0",
		};
	},
	methods: {
		async handleFullSubmit() {
			let instrumentIdList = this.instruments.map(
				(instrument) => instrument.id
			);

			this.locationCoords = await encodeLocation(
				`${this.city}%20${this.country}`
			);
			this.locationName = `${this.city}, ${this.country}`;

			let authuser = getAuth().currentUser;

			if (authuser)
				updateProfile(authuser, {
					displayName: this.name,
				});

			let user: User = {
				name: this.name,
				email: "",
				locationName: this.locationName,
				locationCoord: this.locationCoords,
				styles: this.styles,
				instruments: instrumentIdList,
				likes: 0,
				experienceRating: this.experienceRating,
				about: this.about,
				likedUsers: [],
			};

			this.$emit("edit", user);
		},
		handleStyleSubmit() {
			this.styleInput = this.styleInput.trim();

			if (this.styles.find((style) => style === this.styleInput)) {
				console.log("Style already exists");
				return;
			}

			if (this.styleInput.length > 0) {
				this.styles.push(this.styleInput);
			}
		},
		handleInstrumentSubmit() {
			this.instrumentInput = this.instrumentInput.trim();

			if (
				this.instruments.find(
					(instrument) =>
						instrument.name.toLowerCase() ===
						this.instrumentInput.toLowerCase()
				)
			) {
				console.log("Instrument already exists");
				return;
			}

			let instrumentMatch = this.allInstruments.find(
				(instrument) =>
					instrument.name.toLowerCase() ===
					this.instrumentInput.toLowerCase()
			);

			if (instrumentMatch) {
				this.instruments.push(instrumentMatch);
			} else {
				console.log("Instrument not found in database");
				return;
			}
		},
		removeInstrument(instrument: InstrumentWithID) {
			let index = this.instruments.indexOf(instrument);

			if (index >= 0) {
				this.instruments.splice(index, 1);
			}
		},
		removeStyle(style: string) {
			let index = this.styles.indexOf(style);

			if (index >= 0) {
				this.styles.splice(index, 1);
			}
		},
		setValues() {
			getDoc(doc(getFirestore(), "users", this.userId)).then(
				(snapshot) => {
					let data = snapshot.data();
					if (data) {
						this.name = data.name;
						let words = data.locationName.split(", ");
						this.city = words[0];
						this.country = words[1];
						this.about = data.about;
						this.experienceRating = data.experienceRating;
						this.styles = [...data.styles];
						this.instruments = [];

						data.instruments.forEach((userInstrumentId: string) => {
							let instrument = this.allInstruments.find(
								(instrument) =>
									instrument.id === userInstrumentId
							);

							if (!instrument) {
								console.log(
									"Instrument in user does not exist in db"
								);
								return;
							}

							this.instruments.push(instrument);
						});
					}
				}
			);
		},

		updateTooltipPosition(e: any) {
			this.tooltipTop = (e.layerY - 5).toString() + "px";
			this.tooltipLeft = (e.layerX - 16).toString() + "px";
		},
		async getLocation() {
			if (!navigator.geolocation) {
				alert("Browser does not support geolocation");
			}

			navigator.geolocation.getCurrentPosition(
				(pos) => {
					this.locationCoords = new GeoPoint(
						pos.coords.latitude,
						pos.coords.longitude
					);

					decodeGeopoint(this.locationCoords).then((address) => {
						let words = address.split(", ");
						this.city = words[0];
						this.country = words[1];
					});
				},
				(err) => {
					alert("Failed to get current position: " + err.message);
				}
			);
		},
	},
	created() {
		getDocs(collection(getFirestore(), "instruments")).then((snapshot) => {
			let newInstruments: InstrumentWithID[] = [];

			snapshot.forEach((doc) => {
				newInstruments.push({
					name: doc.data().name,
					iconName: doc.data().iconName,
					id: doc.id,
				});
			});
			this.allInstruments = [...newInstruments];
		});

		window.onmousemove = this.updateTooltipPosition;
	},
	props: {
		show: { type: Boolean, required: true },
		userId: { type: String, required: true },
	},
	watch: {
		show(to, __from) {
			if (to === true) {
				this.setValues();
			}
		},
	},
});
</script>

<style scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s ease;
}

.modal-wrapper {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.modal-container {
	padding: 2rem;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
}

.full-form {
	display: grid;
	grid-auto-flow: row;
	justify-content: center;
	gap: 0.5rem;
}

span {
	display: block;
}

.location-container {
	display: flex;
	align-items: flex-end;
}

.message {
	color: red;
	font-weight: bold;
}

.location-btn {
	background-color: rgb(0, 98, 255);
	border-radius: 10px;
	color: white;
	font-weight: bold;
	padding: 0.2rem;
	margin: 0 0.5rem;
}

.tooltip {
	position: absolute;
	width: 32px;
	text-align: center;
	font-size: 1rem;
	font-weight: bold;
	padding: 0.3rem;
	background-color: white;
	box-shadow: 3px 3px 5px black;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	border-bottom-left-radius: 25px;
	border-bottom-right-radius: 25px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
	opacity: 0;
}

.modal-leave-to {
	opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}

ul {
	width: fit-content;
	list-style: none;
	padding: 0;
}

.rmv-btn {
	background-color: rgb(238, 75, 43);
	color: white;
	font-weight: bold;
	border: none;
}

rmv-btn:hover,
li:hover {
	cursor: pointer;
	text-decoration: line-through;
}

.add-btn {
	margin-left: 1rem;
	background-color: white;
	font-size: 1rem;
	border-radius: 5px;
}

.button-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 1rem 0 0 0;
}

.submit-btn {
	padding: 0.5rem;
	font-size: 1rem;
	background-color: rgb(0, 110, 255);
	color: white;
	font-weight: bold;
	border-radius: 10px;
}

.close-btn {
	padding: 0.5rem;
	font-size: 1rem;
	font-weight: bold;
}
</style>
