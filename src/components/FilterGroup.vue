<script lang="ts" setup>
import { defineComponent } from "vue";
</script>

<template>
	<div class="group-header">
		{{ filterCategory }}
	</div>
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
	},
	watch: {
		checkedOptions(to, from) {
			this.applyFilter();
		},
	},
});
</script>

<style></style>
