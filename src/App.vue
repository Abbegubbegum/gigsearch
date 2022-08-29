<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";
import type { Musician } from "./types";
</script>

<template>
	<div class="content">
		<header>
			<RouterLink to="/" class="home-btn link"
				>GIG<span class="logo-color">search</span>
			</RouterLink>
			<RouterLink to="/Search" class="link" @click="dropdownShow = false">
				Search
			</RouterLink>
		</header>
		<div>
			<RouterView :musicians="musicians" />
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			dropdownShow: false,
			musicians: [
				{ id: "1", name: "Albin", instruments: ["guitar"] },
				{ id: "2", name: "Butter", instruments: ["guitar", "drums"] },
			] as Musician[],
		};
	},
});
</script>

<style scoped>
.content {
	display: grid;
	min-height: 100vh;
	grid-template-rows: auto 1fr;
}
header {
	background-color: white;
	display: grid;
	grid-auto-columns: min-content;
	grid-auto-flow: column dense;
	align-items: center;
	align-content: center;
}

header {
	border: 1px solid rgb(236, 236, 236);
}

header > * {
	height: 100%;
	border-right: 1px solid rgb(236, 236, 236);
}

.link {
	text-decoration: none;
	color: black;
	padding: 1rem;
	font-size: 1.5rem;
	font-weight: bold;
}
.home-btn {
	font-size: 2rem;
	font-weight: bold;
	padding: 0.5rem;
}
.logo-color {
	color: rgb(125, 211, 40);
	font-weight: bolder;
}
</style>
