<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";
</script>

<template>
	<div class="content">
		<header :class="{ hideheader: hideHeader }">
			<RouterLink to="/" class="home-btn link"
				>GIG<span class="logo-color">search</span>
			</RouterLink>
			<RouterLink to="/search/" class="link"> Search </RouterLink>
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
			hideHeader: false,
			lastScrollYUpdate: 0,
		};
	},
	methods: {
		handleScroll() {
			let diff = this.lastScrollYUpdate - window.scrollY;
			if (diff < -100) {
				this.hideHeader = true;
				this.lastScrollYUpdate = window.scrollY;
			} else if (diff > 20) {
				this.hideHeader = false;
				this.lastScrollYUpdate = window.scrollY;
			}
		},
	},
	created() {
		window.onscroll = this.handleScroll;
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
	position: sticky;
	top: 0;
	z-index: 50;
	border: 1px solid rgb(236, 236, 236);
	transition: transform 0.2s ease-out;
}

.hideheader {
	transform: translate(0, -100%);
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
