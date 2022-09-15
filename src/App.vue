<template>
	<v-app>
		<v-app-bar app><v-btn>Button</v-btn></v-app-bar>
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "App",

	data() {
		return {
			//
		};
	},
});
</script>
