<template>
	<div></div>
</template>

<script lang="ts">
import { store } from "@/main";
import router from "@/router";
import { defineComponent } from "vue";
import type { User } from "@/types";

export default defineComponent({
	created() {
		let localSessionId = localStorage.getItem("sessionId");
		let session = store.sessions.find(
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
