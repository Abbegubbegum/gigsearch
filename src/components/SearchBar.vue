<script setup lang="ts">
import { defineComponent } from "vue";
</script>

<template>
	<form @submit.prevent="submit">
		<input
			type="search"
			class="search-bar"
			:placeholder="placeholder"
			v-model="value"
		/>
		<input type="submit" value="🔍" class="submit-btn" />
	</form>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			value: "",
		};
	},
	methods: {
		submit() {
			if (this.value !== "") {
				this.$emit("onSubmit", this.value);
			}
		},
	},
	props: {
		placeholder: {
			type: String,
			default: "What instrument would you like?",
		},
	},
});
</script>

<style scoped>
div {
	display: flex;
	align-items: center;
}

.search-bar,
.submit-btn {
	font-size: 1.5rem;
	background-color: white;
	border-radius: 10px;
}

.search-bar {
	height: 3rem;
	width: 30rem;
	box-shadow: 5px 5px 5px grey;
	border: 2px solid black;
}

.submit-btn {
	border: none;
	height: 2.5rem;
	width: 2.7rem;
	margin-left: -3rem;
}

.submit-btn:hover {
	background-color: lightgray;
}
</style>
