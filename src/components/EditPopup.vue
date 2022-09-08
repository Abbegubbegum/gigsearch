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
						<label>
							<span>Location</span>
							<input type="text" v-model="location" />
						</label>
						<label>
							<span>About</span>
							<textarea
								cols="40"
								rows="5"
								v-model="about"
							></textarea>
						</label>

						<form @submit.prevent="handleStyleSubmit">
							<label>
								<span>Styles</span>
								<input type="text" v-model="styleInput" />
							</label>
						</form>
						<ul>
							<li
								v-for="style in styles"
								@click="removeStyle(style)"
							>
								{{ style }}
							</li>
						</ul>

						<form @submit.prevent="handleInstrumentSubmit">
							<label>
								<span>Instruments</span>
								<input type="text" v-model="instrumentInput" />
							</label>
						</form>
						<ul>
							<li
								v-for="instrument in instruments"
								@click="removeInstrument(instrument)"
							>
								{{ instrument.name }}
							</li>
						</ul>
						<div class="button-container">
							<input
								type="submit"
								value="Submit"
								@click="handleFullSubmit"
							/>
							<button
								class="modal-default-button"
								@click="$emit('close')"
							>
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
import { getInstruments } from "@/main";
import type { Instrument, User } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			user: {} as User,
			name: "",
			location: "",
			experienceRating: "",
			instrumentInput: "",
			instruments: [] as Instrument[],
			styleInput: "",
			styles: [] as string[],
			about: "",
		};
	},
	methods: {
		handleFullSubmit() {
			let instrumentIdList = this.instruments.map(
				(instrument) => instrument.id
			);

			console.log(instrumentIdList);

			let user: User = {
				id: 0,
				username: "",
				password: "",
				name: this.name,
				location: this.location,
				styles: this.styles,
				instruments: instrumentIdList,
				likes: 0,
				experienceRating: 0,
				about: this.about,
			};

			this.$emit("edit", user);
		},
		handleStyleSubmit() {
			this.styleInput = this.styleInput.trim();

			if (this.styles.find((style) => style === this.styleInput)) {
				console.log("Instrument already exists");
				return;
			}

			this.styles.push(this.styleInput);
		},
		async handleInstrumentSubmit() {
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

			let allInstruments = await getInstruments();

			let instrumentMatch = allInstruments.find(
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
		async setValues(user: User) {
			let allInstruments = await getInstruments();

			console.log("set values");
			this.name = user.name;
			this.location = user.location;
			this.about = user.about;
			this.styles = [...user.styles];

			user.instruments.forEach((userInstrumentId) => {
				let instrument = allInstruments.find(
					(instrument) => instrument.id === userInstrumentId
				);

				if (!instrument) {
					console.log("Instrument in user does not exist in db");
					return;
				}

				this.instruments.push(instrument);
			});
		},
		removeInstrument(instrument: Instrument) {
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
	},
	props: {
		show: { type: Boolean, required: true },
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
	padding: 30px;
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

li:hover {
	cursor: pointer;
	text-decoration: line-through;
}

.button-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
