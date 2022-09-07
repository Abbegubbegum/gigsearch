<template>
	<Transition name="modal">
		<div v-if="show" class="modal-mask">
			<div class="modal-wrapper">
				<div class="modal-container">
					<form>
						<label>
							Name
							<input type="text" v-model="name" required />
						</label>
						<label>
							Location
							<input type="text" v-model="location" />
						</label>
						<label>
							About
							<input type="text" v-model="about" />
						</label>

						<form @submit="handleStyleSubmit">
							<label>
								Styles
								<input type="text" v-model="styleInput" />
							</label>
						</form>
						<ul>
							<li v-for="style in styles">{{ style }}</li>
						</ul>
						<input
							type="submit"
							value="Submit"
							@click="handleFullSubmit"
						/>
					</form>

					<button
						class="modal-default-button"
						@click="$emit('close')"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script lang="ts">
import type { User } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
	data() {
		return {
			user: {} as User,
			name: "",
			location: "",
			experienceRating: "",

			instruments: [] as number[],
			styleInput: "",
			styles: [] as string[],
			about: "",
		};
	},
	methods: {
		handleFullSubmit() {},
		handleStyleSubmit() {
			this.styles.push(this.styleInput);
		},
	},
	props: {
		show: { type: Boolean, required: true },
	},
});
</script>

<style>
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
	width: 200px;
	padding: 30px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	display: grid;
	grid-auto-flow: row;
	justify-content: center;
}

.title {
	text-align: center;
}

.timer {
	text-align: center;
	margin: 1rem;
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
</style>
