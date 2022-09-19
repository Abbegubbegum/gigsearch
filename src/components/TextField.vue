<script lang="ts" setup>
import { capitalize, defineComponent } from "vue";
</script>

<template>
	<div class="input-container">
		<input
			:type="type"
			class="input-field"
			:class="{ error: error }"
			:placeholder="label"
			:name="label"
			:id="label"
			required
			v-model="fieldContent"
			@input="handleFieldInput"
		/>
		<label :for="label" class="input-label">{{ capitalize(label) }}</label>
		<div class="error-message" :class="{ showMessage: error }">
			{{ errorMessage }}
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			fieldContent: this.value || "",
		};
	},
	methods: {
		handleFieldInput() {
			this.$emit("input", this.fieldContent);
		},
	},
	props: {
		label: {
			type: String,
			required: true,
		},
		value: {
			type: String,
		},
		type: {
			type: String,
			required: true,
		},
		error: {
			type: Boolean,
			default: false,
		},
		errorMessage: {
			type: String,
			default: "fdsafs",
		},
	},
	watch: {
		value(to, from) {
			this.fieldContent = to;
		},
	},
});
</script>

<style scoped>
.input-container {
	position: relative;
	padding: 1rem 0 0;
	margin-top: 0.7rem;
	width: 100%;
}

.input-field {
	font-family: inherit;
	width: 100%;
	border: 0;
	border-bottom: 2px solid #9b9b9b;
	outline: 0;
	font-size: 1.3rem;
	padding: 0.5rem 0;
	background: transparent;
	transition: all 0.2s;
}
.input-field::placeholder {
	color: transparent;
}
.input-field:placeholder-shown ~ .input-label {
	font-size: 1.3rem;
	cursor: text;
	top: 1.3rem;
}

.input-label {
	position: absolute;
	top: 0;
	display: block;
	transition: 0.2s;
	font-size: 1rem;
	color: #9b9b9b;
}

.input-field:focus {
	padding-bottom: 0.4rem;
	font-weight: 700;
	border-width: 3px;
	border-image: linear-gradient(to right, #11998e, #38ef7d);
	border-image-slice: 1;
}
.input-field:focus ~ .input-label {
	position: absolute;
	top: 0;
	display: block;
	transition: 0.2s;
	font-size: 1rem;
	color: #11998e;
	font-weight: 700;
}

/* reset input */
.input-field:required,
.input-field:invalid {
	box-shadow: none;
}

.error {
	/* text-decoration: underline wavy red; */
	color: red !important;
	border-color: red !important;
	border-image: none !important;
}

.error-message {
	display: none;
}

.showMessage {
	display: block;
	color: red;
	font-weight: bold;
}
</style>
