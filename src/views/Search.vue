<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/Search/SearchBar.vue";
import type { FilterOptions, Instrument, User } from "../types";
import SearchItem from "../components/Search/SearchItem.vue";
import { getInstruments, getUsers } from "../main";
import router from "@/router";
import FilterSection from "../components/Filter/FilterSection.vue";
import SortDropdown from "../components/SortDropdown.vue";
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
		<aside class="fadeTransition" :class="{ hide: initialSearch }">
			<FilterSection
				:filter-options="availableFilterOptions"
				@filter-changed="handleChangedFilter"
			/>
		</aside>
		<main class="fadeTransition" :class="{ hide: initialSearch }">
			<SortDropdown @selected="handleChangedSort" class="sort-dropdown" />
			<SearchItem v-for="user in filteredUsers" :user="user" />
		</main>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			//For styling
			initialSearch: true,
			//The current search
			search: "",
			//The value of the search bar
			searchBarValue: "",
			//Users matching the search
			searchedUsers: [] as User[],
			//Users matching both the search and the filter
			filteredUsers: [] as User[],
			//Instruments matching the search
			searchedInstruments: [] as Instrument[],
			//The filter options that are displayed in the filter section
			availableFilterOptions: {
				styles: [],
				locations: [],
			} as FilterOptions,
			//Current filter on the users
			currentFilter: {
				styles: [],
				mainInstrumentOnly: false,
				locations: [],
			} as FilterOptions,
			currentSort: "",
			users: [] as User[],
			instruments: [] as Instrument[],
		};
	},
	methods: {
		handleSearch() {
			this.initialSearch = false;
			this.search = this.searchBarValue;
			//Empties filter options
			this.availableFilterOptions.styles = [];
			this.availableFilterOptions.locations = [];

			//Updates params
			router.push(/search/ + this.search);

			this.createFilteredDataBySearch();

			this.applyFilter();

			this.sortUsers();
			// console.log(this.availableFilterOptions);
			// console.log(this.search);
			// console.log(this.searchedInstruments);
			// console.log(this.filteredUsers);
		},

		//Populates all relevant data from initial search
		createFilteredDataBySearch() {
			//Create searched instruments list
			this.searchedInstruments = this.instruments.filter((instrument) => {
				return instrument.name
					.toLowerCase()
					.includes(this.search.toLowerCase());
			});

			//Filter users to only contain users who has the searched instruments
			this.searchedUsers = this.users.filter(
				(user) =>
					user.instruments.find(
						(instrumentID) =>
							this.searchedInstruments.find(
								(instrument) => instrument.id === instrumentID
							) !== undefined
					) !== undefined
			);

			//Populate available filter options
			this.searchedUsers.forEach((user) => {
				user.styles.forEach((style) => {
					if (
						!this.availableFilterOptions.styles?.find(
							(existingStyle) => existingStyle === style
						)
					) {
						this.availableFilterOptions.styles?.push(style);
					}
				});
				if (
					!this.availableFilterOptions.locations?.find(
						(existingLocation) => existingLocation === user.location
					)
				) {
					this.availableFilterOptions.locations?.push(user.location);
				}
			});
		},

		//Apply current filter
		applyFilter() {
			if (this.currentFilter.styles) {
				for (
					let i = this.currentFilter.styles.length - 1;
					i >= 0;
					i--
				) {
					if (
						this.availableFilterOptions.styles?.find(
							(availiableStyle) =>
								this.currentFilter.styles &&
								availiableStyle === this.currentFilter.styles[i]
						) === undefined
					) {
						this.currentFilter.styles.splice(i, 1);
					}
				}
			}

			if (this.currentFilter.locations) {
				for (
					let i = this.currentFilter.locations.length - 1;
					i >= 0;
					i--
				) {
					if (
						this.availableFilterOptions.locations?.find(
							(availiableStyle) =>
								this.currentFilter.locations &&
								availiableStyle ===
									this.currentFilter.locations[i]
						) === undefined
					) {
						this.currentFilter.locations.splice(i, 1);
					}
				}
			}

			//Copy the searched users
			this.filteredUsers = [...this.searchedUsers];

			if (this.currentFilter.mainInstrumentOnly) {
				this.filteredUsers = this.filteredUsers.filter((user) =>
					this.searchedInstruments.find(
						(instrument) => instrument.id === user.instruments[0]
					)
				);
			}

			//If styles filter is active
			if (
				this.currentFilter.styles &&
				this.currentFilter.styles.length > 0
			) {
				this.filteredUsers = this.filteredUsers.filter((user) =>
					user.styles.find((style) =>
						this.currentFilter.styles?.find(
							(filterStyle) => filterStyle === style
						)
					)
				);
			}

			if (
				this.currentFilter.locations &&
				this.currentFilter.locations.length > 0
			) {
				this.filteredUsers = this.filteredUsers.filter((user) =>
					this.currentFilter.locations?.find(
						(filterLocation) => filterLocation === user.location
					)
				);
			}
		},

		sortUsers() {
			//Sort by relevant main instruments first
			this.filteredUsers.sort((a, b): number => {
				let aMainMatch = this.searchedInstruments.find(
					(instrument) => instrument.id === a.instruments[0]
				);
				let bMainMatch = this.searchedInstruments.find(
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

			if (this.currentSort === "likes") {
				this.filteredUsers.sort((a, b): number => {
					return b.likes - a.likes;
				});
			} else if (this.currentSort === "level") {
				this.filteredUsers.sort((a, b): number => {
					return b.experienceRating - a.experienceRating;
				});
			}
		},

		//Handle the params
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

		handleChangedFilter(newFilter: FilterOptions) {
			this.currentFilter = newFilter;
			this.applyFilter();
			this.sortUsers();
		},

		handleChangedSort(newSort: string) {
			this.currentSort = newSort;
			this.sortUsers();
		},
	},
	async mounted() {
		this.handleParams();
		this.users = await getUsers();
		this.instruments = await getInstruments();
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
	transition: opacity 0.2s linear 0s;
}

.content-container {
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 3fr;
	grid-template-rows: 10vh 1fr;
}

aside {
	position: sticky;
	top: 20px;
	grid-row-start: 2;
}

main {
	display: flex;
	flex-direction: column;
	grid-row-start: 2;
	padding: 0 3rem 3rem 3rem;
	align-items: center;
	gap: 2rem;
}

.sort-dropdown {
	align-self: flex-end;
}
</style>
