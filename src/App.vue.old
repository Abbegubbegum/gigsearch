<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";
import { getAuth, signOut, onAuthStateChanged } from "@firebase/auth";
</script>

<template>
	<div class="content">
		<header :class="{ hideheader: hideHeader }">
			<RouterLink to="/" class="home-btn link"
				>GIG<span class="logo-color">search</span>
			</RouterLink>
			<RouterLink to="/search/" class="link"> Search </RouterLink>
			<div
				class="dropdown-container push-right"
				@mouseover="dropdownHover = true"
				@mouseleave="dropdownHover = false"
			>
				<RouterLink :to="profileButtonLink" class="link">
					{{ profileButtonLabel }}
				</RouterLink>
				<div class="dropdown-content" v-if="showDropdown">
					<RouterLink
						:to="'/profile/' + getAuth().currentUser?.uid"
						class="dropdown-item"
					>
						Profile
					</RouterLink>
					<button type="button" class="dropdown-item" @click="logout">
						Logout
					</button>
				</div>
			</div>
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
			authed: false,
			dropdownHover: false,
			profileButtonLink: "/login",
			profileButtonLabel: "Login",
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
		logout() {
			signOut(getAuth());
		},
	},
	computed: {
		showDropdown() {
			return this.dropdownHover && this.authed;
		},
	},
	created() {
		window.onscroll = this.handleScroll;
		onAuthStateChanged(getAuth(), (user) => {
			if (user) {
				this.authed = true;
				this.profileButtonLink = "/profile/" + user.uid;
				if (user.displayName) {
					this.profileButtonLabel = user.displayName;
				} else if (user.email) {
					this.profileButtonLabel = user.email;
				} else {
					this.profileButtonLabel = "UNDEFINED";
				}
			} else {
				this.authed = false;
				this.profileButtonLink = "/login";
				this.profileButtonLabel = "Login";
			}
		});
	},
});
</script>

<style scoped>
.content {
	display: grid;
	min-height: 100vh;
	grid-template-rows: 5rem 1fr;
}

header {
	background-color: white;
	display: flex;
	justify-content: flex-start;
	align-items: center;
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
	display: inline-block;
	height: 100%;
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

.push-right {
	margin-left: auto;
	border-left: 1px solid rgb(236, 236, 236);
}

.dropdown-content {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.dropdown-item {
	width: 100%;
	font-size: 1rem;
	font-weight: 400;
	text-decoration: none;
	color: black;
	background-color: whitesmoke;
	text-align: end;
	border: 1px solid rgb(236, 236, 236);
	padding: 0.5rem;
}
.dropdown-item:hover {
	cursor: pointer;
	background-color: rgb(226, 225, 225);
}
</style>
