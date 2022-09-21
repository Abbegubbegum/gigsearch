<script setup lang="ts">
import router from "@/router";
import type { Conversation, UserWithID } from "@/types";
import { getAuth } from "@firebase/auth";
import { defineComponent } from "vue";
</script>

<template>
	<div></div>
</template>
<script lang="ts">
export default defineComponent({
	data() {
		return {
			user: {} as UserWithID,
            conversations: [] as Conversation[],

		};
	},
	async created() {
		let currentUser = getAuth().currentUser;

		if (!currentUser) {
			router.push("/");
			return;
		}

        
	},
});
</script>
<style scoped></style>
