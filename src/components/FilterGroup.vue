<script lang="ts" setup>
import { defineComponent, capitalize } from "vue";
</script>

<template>
	<div class="group-container">
		<div class="group-header">{{ capitalize(filterCategory) }}:</div>
		<div class="button-group">
			<div class="option-button" v-for="option in filterOptions">
				<label>
					{{ option }}
					<input
						type="checkbox"
						:value="option"
						v-model="checkedOptions"
					/>
				</label>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			checkedOptions: [] as string[],
		};
	},
	props: {
		filterCategory: {
			type: String,
			required: true,
		},
		filterOptions: {
			type: Array<String>,
		},
	},
	emits: ["filterChanged"],
	methods: {
		applyFilter() {
			this.$emit("filterChanged", {
				[this.filterCategory]: this.checkedOptions,
			});
		},
		capitalize,
	},
	watch: {
		checkedOptions(to, from) {
			this.applyFilter();
		},
	},
});
</script>

<style scoped>
.group-container {
	display: grid;
	grid-template-rows: auto 1fr;
}

.button-group {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
</style>
