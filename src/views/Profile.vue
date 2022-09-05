<template>
	<div></div>
</template>

<script lang="ts">
import { getSessions } from "@/main";
import router from "@/router";
import { defineComponent } from "vue";
import type { Session, User } from "@/types";

export default defineComponent({
	data() {
		return {
			sessions: [] as Session[],
		};
	},
	async created() {
		let localSessionId = localStorage.getItem("sessionId");
		this.sessions = await getSessions();
		let session = this.sessions.find(
			(session) => session.sessionId === localSessionId
		);

		if (!session) {
			router.push("/login");
			return;
		}

		if (this.$route.params.uid === session.uId.toString()) {
			router.push(`/profile/${session.uId}`);
		} else {
			console.error("Weird user matching problem");
		}
	},
});
</script>

<style></style>
