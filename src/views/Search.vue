<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
import type { Instrument, User } from "../types";
import SearchItem from "../components/SearchItem.vue";
import { data } from "../main";
import router from "@/router";
</script>

<template>
	<div class="content-container">
		<div
			class="searchbar-wrapper"
			:class="{ initialSearch: initialSearch }"
		>
			<SearchBar
				@on-submit="handleSearch"
				:value="searchBarValue"
				@on-input="(val: string) => {searchBarValue = val;}"
				class="searchbar"
				:class="{ initialSearch: initialSearch }"
			/>
		</div>
		<aside class="fadeTransition" :class="{ hide: initialSearch }"></aside>
		<main class="fadeTransition" :class="{ hide: initialSearch }">
			<SearchItem v-for="user in filteredUsers" :user="user" />
		</main>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			initialSearch: true,
			search: "",
			searchBarValue: "",
			transitionOver: false,
			filteredUsers: [] as User[],
			filteredInstruments: [] as Instrument[],
			data,
		};
	},
	methods: {
		handleSearch() {
			this.initialSearch = false;
			this.search = this.searchBarValue;
			router.push(/search/ + this.search);

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
		handleParams() {
			if (this.$route.params.search === undefined) return;
			if (this.$route.params.search.length > 0) {
				this.searchBarValue = this.$route.params.search.toString();
				this.handleSearch();
			} else {
				this.searchBarValue = "";
				this.initialSearch = true;
			}
		},
	},
	created() {
		this.handleParams();
	},
	watch: {
		$route(to, from) {
			this.handleParams();
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
	opacity: 1;
	transition: opacity 0.4s linear 0.6s;
}

.hide {
	opacity: 0;
	transition: opacity 0.4s linear 0s;
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
