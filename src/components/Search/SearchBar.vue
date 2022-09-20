<script setup lang="ts">
import { defineComponent } from "vue";
</script>

<template>
	<form @submit.prevent="submit">
		<div>
			<input
				type="search"
				class="search-bar"
				placeholder="What instrument would you like?"
				v-model="searchContent"
				@input="handleSearchInput"
				autofocus
			/>
			<input
				type="search"
				class="search-bar"
				placeholder="Where?"
				v-model="locationContent"
				@input="handleLocationInput"
			/>
		</div>

		<input type="submit" value="🔍" class="submit-btn" />
	</form>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			searchContent: this.searchvalue || "",
			locationContent: this.locationvalue || "",
		};
	},
	methods: {
		submit() {
			if (this.searchContent !== "" && this.locationContent !== "") {
				this.$emit("onSubmit");
			}
		},
		handleSearchInput() {
			this.$emit("onSearchInput", this.searchContent);
		},
		handleLocationInput() {
			this.$emit("onLocationInput", this.locationContent);
		},
	},
	props: {
		searchvalue: {
			type: String,
		},
		locationvalue: {
			type: String,
		},
	},
	watch: {
		searchvalue: function (to, from) {
			this.searchContent = to;
		},
		locationvalue: function (to, from) {
			this.locationContent = to;
		},
	},
});
</script>

<style scoped>
form {
	display: flex;
	align-items: center;
	padding: 1rem;
	border-radius: 10px;
	background-color: rgb(95, 95, 95);
	box-shadow: 10px 10px 20px gray;
}

.search-bar,
.submit-btn {
	font-size: 1.5rem;
	background-color: white;
}

.search-bar {
	display: block;
	height: 3rem;
	width: 30rem;
	border: none;
	border-bottom: 1px solid black;
}

.search-bar:focus {
	outline: none;
}

.submit-btn {
	background-color: white;
	height: 6rem;
	width: 2.7rem;
	margin: 0.5rem;
}

.submit-btn:hover {
	background-color: lightgray;
}
</style>
