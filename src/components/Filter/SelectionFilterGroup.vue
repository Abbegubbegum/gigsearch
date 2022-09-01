<script lang="ts" setup>
import { defineComponent, capitalize } from "vue";
</script>

<template>
	<div class="group-container">
		<div class="group-header">{{ capitalize(filterLabel) }}:</div>
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
		filterLabel: {
			type: String,
			required: true,
		},
		filterOptions: {
			type: Array<String>,
		},
		objectKey: {
			type: String,
			required: true,
		},
	},
	emits: ["filterChanged"],
	methods: {
		applyFilter() {
			this.$emit("filterChanged", {
				[this.objectKey]: this.checkedOptions,
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

<style>
.group-container {
	display: grid;
	width: 100%;
	grid-template-rows: auto 1fr;
	padding: 0.5rem;
}

.button-group {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
</style>
