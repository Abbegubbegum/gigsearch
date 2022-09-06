<template>
	<div></div>
</template>

<script lang="ts">
import { getSessions, getUserFromSessionKey } from "@/main";
import router from "@/router";
import { defineComponent } from "vue";
import type { Session, User } from "@/types";

export default defineComponent({
	data() {
		return {
			authedUser: false,
		};
	},
	async created() {
		let localsessionKey = localStorage.getItem("sessionKey");

		if (!localsessionKey) return;

		let user = await getUserFromSessionKey(localsessionKey);

		if (!user) {
			localStorage.removeItem("sessionKey");
			return;
		}

		if (user.id.toString() === this.$route.params.uid) {
			this.authedUser = true;
		}
	},
});
</script>

<style></style>
