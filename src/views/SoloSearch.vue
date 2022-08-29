<script setup lang="ts">
import { defineComponent } from "vue";
import SearchBar from "../components/SearchBar.vue";
</script>

<template>
	<Transition name="fade" @after-leave="transitionOver = true">
		<SearchBar
			@on-submit="handleSearch"
			class="initial-search"
			v-if="!searched"
			v-model="search"
		/>
	</Transition>
	<Transition name="fade">
		<div class="search-container" v-if="transitionOver">
			<header>
				<SearchBar @on-submit="handleSearch" />
			</header>
			<aside></aside>
			<main></main>
		</div>
	</Transition>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			searched: false,
			search: "",
			transitionOver: false,
		};
	},
	methods: {
		handleSearch(value: string) {
			this.searched = true;
			this.search = value;
			console.log(this.search);
		},
	},
});
</script>

<style scoped>
.initial-search {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 10;
}

.fade-leave-active,
.fade-enter-active {
	transition: all 0.3s ease;
}

.fade-leave-to,
.fade-enter-from {
	opacity: 0;
}

.search-container {
	height: 100%;
	width: 100%;
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: 10vh 1fr;
}

header {
	grid-column-start: 1;
	grid-column-end: 3;
	justify-content: center;
	align-items: center;
}
</style>
