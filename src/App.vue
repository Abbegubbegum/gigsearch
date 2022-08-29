<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";
</script>

<template>
	<div class="content">
		<header>
			<div class="dropdown" @mouseleave="dropdownShow = false">
				<button class="dropbtn" @click="dropdownShow = !dropdownShow">
					☰
				</button>
				<div v-if="dropdownShow" class="dropdown-content">
					<RouterLink
						to="/SoloSearch"
						class="link"
						@click="dropdownShow = false"
						>Find Solo Musician</RouterLink
					>
				</div>
			</div>
			<RouterLink to="/" class="home-btn link"
				>GIG<span class="logo-color">search</span>
			</RouterLink>
		</header>
		<div>
			<RouterView />
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			dropdownShow: false,
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
}

header {
	border: 1px solid rgb(236, 236, 236);
}

header > * {
	border-right: 1px solid rgb(236, 236, 236);
}

.link {
	text-decoration: none;
	color: black;
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

.dropbtn {
	background-color: inherit;
	color: black;
	font-size: 2rem;
	font-weight: bold;
	border: none;
	height: 100%;
	padding: 0 1rem;
}

.dropdown {
	height: 100%;
	position: relative;
	display: inline-block;
}

.dropdown-content {
	position: absolute;
	background-color: #f1f1f1;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: 1;
}

.dropdown-content .link {
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	white-space: nowrap;
}

.dropdown-content a:hover {
	background-color: lightgray;
}

.dropdown:hover .dropbtn {
	background-color: lightgray;
}
</style>
