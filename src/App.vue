<template>
	<v-app class="fill-height">
		<v-app-bar app> <button class="pa-6">Click Me!</button> </v-app-bar>
		<v-main>
			<v-container fluid>
				<router-view />
			</v-container>
		</v-main>

		<v-footer app> Footer </v-footer>
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
