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
}

.search-bar,
.submit-btn {
	font-size: 1.5rem;
	background-color: white;
	border-radius: 10px;
}

.search-bar {
	display: block;
	height: 3rem;
	width: 30rem;
	box-shadow: 5px 5px 5px grey;
	border: 2px solid black;
}

.submit-btn {
	background-color: lightgray;
	height: 6rem;
	width: 2.7rem;
	margin: 0.5rem;
}

.submit-btn:hover {
	background-color: lightslategray;
}
</style>
