<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
import type { Instrument, User } from "../types";
import SearchItem from "../components/SearchItem.vue";
import { data } from "../main";
</script>

<template>
	<div class="content-container">
		<div
			class="searchbar-wrapper"
			:class="{ initialSearch: initialSearch }"
		>
			<SearchBar
				@on-submit="handleSearch"
				class="searchbar"
				:class="{ initialSearch: initialSearch }"
			/>
		</div>
		<aside class="fadeTransition" :class="{ hide: initialSearch }"></aside>
		<main class="fadeTransition" :class="{ hide: initialSearch }">
			<SearchItem
				v-for="user in filteredUsers"
				:user="user"
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
			filteredUsers: [] as User[],
			filteredInstruments: [] as Instrument[],
			data,
		};
	},
	methods: {
		handleSearch(value: string) {
			this.initialSearch = false;
			this.search = value;

			this.filteredInstruments = data.instruments.filter((instrument) => {
				return instrument.name
					.toLowerCase()
					.includes(this.search.toLowerCase());
			});

			this.filteredUsers = data.users.filter(
				(user) =>
					user.instruments.find(
						(instrumentID) =>
							this.filteredInstruments.find(
								(instrument) => instrument.id === instrumentID
							) !== undefined
					) !== undefined
			);

			this.filteredUsers.sort((a, b): number => {
				let aMainMatch = this.filteredInstruments.find(
					(instrument) => instrument.id === a.instruments[0]
				);
				let bMainMatch = this.filteredInstruments.find(
					(instrument) => instrument.id === b.instruments[0]
				);

				if (
					(aMainMatch && bMainMatch) ||
					(!aMainMatch && !bMainMatch)
				) {
					return 0;
				} else if (aMainMatch) {
					return -1;
				} else if (bMainMatch) {
					return 1;
				}
				return 0;
			});

			console.log(this.search);
			console.log(this.filteredInstruments);
			console.log(this.filteredUsers);
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

.fadeTransition {
	transition: opacity 0.4s linear 0.6s;
}

.hide {
	opacity: 0;
}

.content-container {
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-template-rows: 10vh 1fr;
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
