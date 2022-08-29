<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
</script>

<template>
	<div class="content-container">
		<div
			class="searchbar-wrapper"
			:class="{ initialSearch: initialSearch }"
		>
			<SearchBar
				@submit="handleSearch"
				class="searchbar"
				:class="{ initialSearch: initialSearch }"
			/>
		</div>
		<aside></aside>
		<main></main>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			initialSearch: true,
			search: "",
			transitionOver: false,
		};
	},
	methods: {
		handleSearch(value: string) {
			this.initialSearch = false;
			this.search = value;
			console.log(this.search);
		},
	},
});
</script>

<style scoped>
.searchbar-wrapper {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.searchbar {
	transition: transform 1s ease;
	margin-top: 1rem;
}

.searchbar.initialSearch {
	transform: translate(0, 35vh);
	z-index: 99999;
}

.content-container {
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: 1fr 11fr;
}

aside {
	grid-row-start: 2;
}

main {
	grid-row-start: 2;
}
</style>
