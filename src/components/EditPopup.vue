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
import TextField from "./TextField.vue";
</script>

<template>
	<Transition name="modal">
		<div v-if="show" class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<form @submit.prevent class="full-form">
						<TextField
							class="field-input"
							label="name"
							type="text"
							:value="name"
							@input="(e) => (name = e.target.value)"
							:error="nameError"
							:error-message="nameErrorMessage"
						/>
						<div class="location-container">
							<TextField
								class="field-input"
								label="city"
								type="text"
								:value="city"
								@input="(e) => (city = e.target.value)"
								:error="cityError"
								:error-message="cityErrorMessage"
							/>
							<TextField
								class="field-input"
								label="country"
								type="text"
								:value="country"
								@input="(e) => (country = e.target.value)"
								:error="countryError"
								:error-message="countryErrorMessage"
							/>
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

						<form
							@submit.prevent="handleStyleSubmit"
							class="sub-form"
						>
							<TextField
								class="field-input"
								label="styles"
								type="text"
								:value="styleInput"
								@input="(e) => (styleInput = e.target.value)"
								:error="styleError"
								:error-message="styleErrorMessage"
							/>
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

						<form
							@submit.prevent="handleInstrumentSubmit"
							class="sub-form"
						>
							<TextField
								class="field-input"
								label="instruments"
								type="text"
								:value="instrumentInput"
								@input="
									(e) => (instrumentInput = e.target.value)
								"
								:error="instrumentError"
								:error-message="instrumentErrorMessage"
							/>
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
			nameError: false,
			nameErrorMessage: "",
			locationName: "",
			locationCoords: {} as GeoPoint,
			city: "",
			cityError: false,
			cityErrorMessage: "",
			country: "",
			countryError: false,
			countryErrorMessage: "",
			experienceRating: 0,
			instrumentInput: "",
			instrumentError: false,
			instrumentErrorMessage: "",
			instruments: [] as InstrumentWithID[],
			styleInput: "",
			styleError: false,
			styleErrorMessage: "",
			styles: [] as string[],
			about: "",
			allInstruments: [] as InstrumentWithID[],
			showTooltip: false,
			tooltipTop: "15px",
			tooltipLeft: "25%",
		};
	},
	methods: {
		async handleFullSubmit() {
			if (this.instruments.length === 0) {
				this.instrumentError = true;
				this.instrumentErrorMessage =
					"Add at least one instrument (ex. Guitar, Piano, Singer)";
				return;
			}

			if (this.name.trim() === "") {
				this.nameError = true;
				this.nameErrorMessage = "Name cannot be blank";
				return;
			}

			if (this.city.trim() === "") {
				this.cityError = true;
				this.cityErrorMessage = "City cannot be blank";
				return;
			}

			if (this.country.trim() === "") {
				this.countryError = true;
				this.countryErrorMessage = "Country cannot be blank";
				return;
			}

			let instrumentIdList = this.instruments.map(
				(instrument) => instrument.id
			);

			this.locationCoords = await encodeLocation(
				`${this.city}%20${this.country}`
			);

			console.log(this.locationCoords);

			if (
				this.locationCoords.latitude === 0 &&
				this.locationCoords.longitude === 0
			) {
				alert("Location not found");
				return;
			}

			// this.locationName = await decodeGeopoint(this.locationCoords);

			this.locationName = `${this.city}, ${this.country}`;

			let authuser = getAuth().currentUser;

			if (authuser)
				updateProfile(authuser, {
					displayName: this.name.replace(">", ""),
				});

			let user: User = {
				name: this.name.replace(">", ""),
				email: "",
				locationName: this.locationName,
				locationCoord: this.locationCoords,
				styles: this.styles,
				instruments: instrumentIdList,
				likes: 0,
				experienceRating: this.experienceRating,
				about: this.about.trim().replace(">", ""),
				likedUsers: [],
			};

			this.$emit("edit", user);
		},
		handleStyleSubmit() {
			this.styleInput = this.styleInput.trim();

			if (this.styles.find((style) => style === this.styleInput)) {
				this.styleError = true;
				this.styleErrorMessage = "Style already exists in list";
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
				this.instrumentError = true;
				this.instrumentErrorMessage =
					"Instrument already exists in list";
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
				this.instrumentError = true;
				this.instrumentErrorMessage =
					"Instrument not found in our database";
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
			if (this.getBrowser() !== "Firefox") return;

			this.tooltipTop = (e.layerY - 5).toString() + "px";
			this.tooltipLeft = (e.layerX - 16).toString() + "px";
		},
		async getLocation() {
			if (!navigator.geolocation) {
				alert("Browser does not support geolocation");
				return;
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
		getBrowser(): string {
			const agent = navigator.userAgent.toLowerCase();
			switch (true) {
				case agent.indexOf("edge") > -1:
					return "MS Edge";
				case agent.indexOf("edg/") > -1:
					return "Edge";
				case agent.indexOf("opr") > -1:
					return "Opera";
				case agent.indexOf("chrome") > -1:
					return "Chrome";
				case agent.indexOf("trident") > -1:
					return "MS IE";
				case agent.indexOf("firefox") > -1:
					return "Firefox";
				case agent.indexOf("safari") > -1:
					return "Safari";
				default:
					return "other";
			}
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
			this.setValues();
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
		styleInput(__to, __from) {
			this.styleError = false;
			this.styleErrorMessage = "";
		},
		instrumentInput(__to, __from) {
			this.instrumentError = false;
			this.instrumentErrorMessage = "";
		},
		name(__to, __from) {
			this.nameError = false;
			this.nameErrorMessage = "";
		},
		city(__to, __from) {
			this.cityError = false;
			this.cityErrorMessage = "";
		},
		country(__to, __from) {
			this.countryError = false;
			this.countryErrorMessage = "";
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

.field-input {
	width: 14rem;
}

span {
	display: block;
}

.location-container {
	display: flex;
	align-items: flex-start;
}

.location-btn {
	background-color: rgb(0, 98, 255);
	border-radius: 10px;
	color: white;
	font-weight: bold;
	padding: 0.2rem;
	margin: 2.5rem 0.5rem 0 0;
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

.sub-form {
	display: flex;
	align-items: flex-start;
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
	font-weight: bold;
}

.add-btn {
	margin-top: 2.5rem;
	margin-left: 1rem;
	background-color: rgb(11, 175, 5);
	color: white;
	font-weight: bold;
	font-size: 1rem;
	border-radius: 5px;
	height: 2rem;
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
