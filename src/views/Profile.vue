<template>
	<div class="main-container">
		<div class="content-container">
			<div class="profile-header">
				<div class="name-title">
					<h1>{{ capitalize(user.name) }}</h1>
					<h2>@{{ user.username }}</h2>
					<h2 class="location-text">
						<img
							src="@/assets/icons/map-pin.svg"
							alt="Map pin icon"
							width="17"
						/>
						{{ user.location }}
					</h2>
				</div>
				<button
					v-if="authedUser"
					type="button"
					@click="editPopupShow = true"
				>
					Edit Page
				</button>
			</div>
		</div>
		<EditPopup
			:show="editPopupShow"
			@close="editPopupShow = false"
			@on-edit="handleEdit"
		/>
	</div>
</template>

<script lang="ts">
import { getSessions, getUser, getUserFromSessionKey } from "@/main";
import router from "@/router";
import { defineComponent, capitalize } from "vue";
import type { Session, User } from "@/types";
import EditPopup from "../components/EditPopup.vue";

export default defineComponent({
	data() {
		return {
			user: {} as User,
			authedUser: false,
			editPopupShow: false,
		};
	},
	methods: {
		capitalize,
		handleEdit() {},
	},
	async created() {
		let res = await getUser(parseInt(this.$route.params.uid.toString()));
		if (!res) {
			router.push("/404");
			return;
		}
		this.user = res;
		let localsessionKey = localStorage.getItem("sessionKey");
		if (!localsessionKey) return;
		let authedUser = await getUserFromSessionKey(localsessionKey);
		if (!authedUser) {
			localStorage.removeItem("sessionKey");
			return;
		}
		if (authedUser.id === this.user.id) {
			this.authedUser = true;
		}
	},
	components: { EditPopup },
});
</script>

<style scoped>
.main-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: lightgray;
}

.content-container {
	height: 95%;
	width: clamp(200px, 70%, 900px);
	border: 1px solid grey;
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

.profile-header {
	display: flex;
	justify-content: space-between;
}

h1 {
	font-size: 2.5rem;
	font-weight: bold;
}

h2 {
	color: grey;
	font-size: 1.3rem;
}

.location-text {
	margin: 0;
	padding: 0;
}
</style>
