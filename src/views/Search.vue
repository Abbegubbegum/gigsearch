<script setup lang="ts">
import { defineComponent, type PropType } from "vue";
import SearchBar from "../components/SearchBar.vue";
import type { Musician } from "../types";
import SearchItem from "../components/SearchItem.vue";
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
				@transitionend="transitionOver = true"
			/>
		</div>
		<aside v-show="transitionOver"></aside>
		<main v-show="transitionOver">
			<SearchItem
				v-for="musician in filteredMusicians"
				:musician="musician"
			/>
		</main>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			initialSearch: true,
			search: "",
			transitionOver: false,
			filteredMusicians: [] as Musician[],
		};
	},
	methods: {
		handleSearch(value: string) {
			this.initialSearch = false;
			this.search = value;

			this.filteredMusicians = this.musicians.filter((musician) =>
				musician.instruments.find((instrument) =>
					instrument.name
						.toLowerCase()
						.includes(this.search.toLowerCase())
				)
			);

			console.log(this.search);
			console.log(this.musicians);
			console.log(this.filteredMusicians);
		},
	},
	props: {
		musicians: { type: Array<Musician>, required: true },
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
	grid-template-columns: 1fr 3fr;
	grid-template-rows: 1fr 11fr;
}

aside {
	grid-row-start: 2;
}

main {
	display: flex;
	flex-direction: column;
	grid-row-start: 2;
	padding: 3rem;
	align-items: center;
	gap: 2rem;
}
</style>
