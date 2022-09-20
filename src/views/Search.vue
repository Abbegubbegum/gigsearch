<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/Search/SearchBar.vue";
import type { FilterOptions, InstrumentWithID, UserWithID } from "../types";
import SearchItem from "../components/Search/SearchItem.vue";
import router from "@/router";
import FilterSection from "../components/Filter/FilterSection.vue";
import SortDropdown from "../components/SortDropdown.vue";
import {
	onSnapshot,
	collection,
	getFirestore,
	getDocs,
	GeoPoint,
} from "@firebase/firestore";
import { encodeLocation, getDistance } from "@/main";
</script>

<template>
	<div class="content-container">
		<div
			class="searchbar-wrapper"
			:class="{ initialSearch: initialSearch }"
			v-if="loaded"
		>
			<SearchBar
				@on-submit="setSearch"
				:searchvalue="searchBarValue"
				:locationvalue="locationValue"
				@on-search-input="(val: string) => {searchBarValue = val;}"
				@on-location-input="(val: string) => {locationValue = val;}"
				class="searchbar"
				:class="{ initialSearch: initialSearch }"
			/>
			<SortDropdown
				@selected="handleChangedSort"
				class="sort-dropdown fadeTransition"
				:class="{ hide: initialSearch }"
			/>
		</div>
		<div v-else class="loading-wrapper">
			<div class="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
		<aside class="fadeTransition" :class="{ hide: initialSearch }">
			<FilterSection
				:filter-options="availableFilterOptions"
				@filter-changed="handleChangedFilter"
			/>
		</aside>
		<main class="fadeTransition" :class="{ hide: initialSearch }">
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
			// The current location search
			location: "",
			//The value of the search bar
			searchBarValue: "",
			// The value of the location search bar
			locationValue: "",
			// The coords of the location search
			searchedGeopoint: {} as GeoPoint,
			//Users matching the search
			searchedUsers: [] as UserWithID[],
			//Users matching both the search and the filter
			filteredUsers: [] as UserWithID[],
			//Instruments matching the search
			searchedInstruments: [] as InstrumentWithID[],
			//The filter options that are displayed in the filter section
			availableFilterOptions: {
				styles: [],
				locations: [],
			} as FilterOptions,
			//Current filter on the users
			currentFilter: {
				styles: [],
				mainInstrumentOnly: false,
			} as FilterOptions,
			currentSort: "",
			users: [] as UserWithID[],
			instruments: [] as InstrumentWithID[],
			loaded: false,
		};
	},
	methods: {
		setSearch() {
			router.push(`/search/${this.searchBarValue}/${this.locationValue}`);
		},
		async handleSearch() {
			this.initialSearch = false;
			this.search = this.searchBarValue;
			this.location = this.locationValue;
			//Empties filter options
			this.availableFilterOptions.styles = [];

			await this.createFilteredDataBySearch();

			this.applyFilter();

			this.sortUsers();

			// console.log(this.availableFilterOptions);
			// console.log(this.search);
			// console.log(this.searchedInstruments);
			// console.log(this.filteredUsers);
		},

		//Populates all relevant data from initial search
		async createFilteredDataBySearch() {
			//Create searched instruments list
			this.searchedInstruments = this.instruments.filter((instrument) => {
				return instrument.name
					.toLowerCase()
					.includes(this.search.toLowerCase());
			});

			//Fetch the searched geopoint
			this.searchedGeopoint = await encodeLocation(
				this.location.replace(" ", "%20")
			);

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
			});
		},

		//Apply current filter
		applyFilter() {
			//Copy the searched users
			this.filteredUsers = [...this.searchedUsers];

			// Remove all styles from current filter that are not in availablefilter options
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

			//Filter based on main instruments only
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
		},

		sortUsers() {
			//Sort by relevant main instruments
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

			//Sort by closest to search location
			this.filteredUsers.sort((a, b): number => {
				return (
					getDistance(a.locationCoord, this.searchedGeopoint) -
					getDistance(b.locationCoord, this.searchedGeopoint)
				);
			});
		},

		//Handle the params
		handleParams() {
			if (
				this.$route.params.search === undefined ||
				this.$route.params.location === undefined
			)
				return;
			if (
				this.$route.params.search.length > 0 &&
				this.$route.params.location
			) {
				this.searchBarValue = this.$route.params.search.toString();
				this.locationValue = this.$route.params.location.toString();
				this.handleSearch();
			} else {
				this.searchBarValue = "";
				this.locationValue = "";
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
	async created() {
		let snapshot = await getDocs(collection(getFirestore(), "users"));

		snapshot.forEach((userSnapshot) => {
			let data = userSnapshot.data();
			if (data) {
				this.users.push({
					id: userSnapshot.id,
					name: data.name,
					email: data.email,
					likes: data.likes,
					experienceRating: data.experienceRating,
					locationName: data.locationName,
					locationCoord: data.locationCoord,
					instruments: data.instruments,
					styles: data.styles,
					about: data.about,
					likedUsers: data.likedUsers,
				});
			}
		});

		onSnapshot(collection(getFirestore(), "users"), (snapshot) => {
			this.users = [];
			snapshot.forEach((userSnapshot) => {
				let data = userSnapshot.data();
				if (data) {
					this.users.push({
						id: userSnapshot.id,
						name: data.name,
						email: data.email,
						likes: data.likes,
						experienceRating: data.experienceRating,
						locationName: data.locationName,
						locationCoord: data.locationCoord,
						instruments: data.instruments,
						styles: data.styles,
						about: data.about,
						likedUsers: data.likedUsers,
					});
				}
			});
		});

		getDocs(collection(getFirestore(), "instruments")).then((snapshot) => {
			let newInstruments: InstrumentWithID[] = [];

			snapshot.forEach((doc) => {
				newInstruments.push({
					name: doc.data().name,
					iconName: doc.data().iconName,
					id: doc.id,
				});
			});
			this.instruments = [...newInstruments];
			this.loaded = true;
			this.handleParams();
		});
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
	flex-direction: column;
	align-items: center;
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
	grid-template-rows: 25vh auto 1fr;
}

aside {
	grid-row-start: 2;
}

main {
	display: flex;
	flex-direction: column;
	grid-row-start: 3;
	padding: 3rem;
	align-items: center;
	gap: 2rem;
}

.sort-dropdown {
	align-self: center;
	margin-top: 1rem;
}

.loading-wrapper {
	position: absolute;
	height: 100%;
	width: 100%;
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
}

.lds-ring {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}
.lds-ring div {
	box-sizing: border-box;
	display: block;
	position: absolute;
	width: 64px;
	height: 64px;
	margin: 8px;
	border: 8px solid gray;
	border-radius: 50%;
	animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	border-color: gray transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
	animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
	animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
	animation-delay: -0.15s;
}
@keyframes lds-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@media only screen and (min-width: 900px) {
	.content-container {
		grid-template-columns: auto 1fr;
	}
	main {
		grid-row-start: 2;
	}
	.searchbar-wrapper {
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.searchbar {
		margin-left: auto;
		margin-right: -10rem;
	}

	.sort-dropdown {
		margin-left: auto;
		margin-right: 1rem;
	}
	main {
		padding: 0 3rem 3rem 3rem;
	}
}
</style>
