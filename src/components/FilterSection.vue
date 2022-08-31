<script setup lang="ts">
import FilterGroup from "./FilterGroup.vue";
import { defineComponent, type PropType } from "vue";
import type { FilterOptions } from "@/types";
</script>

<template>
	<div>
		<span class="filter-title">Filter By:</span>
		<FilterGroup
			filter-category="styles"
			:filter-options="filterOptions.styles"
			@filter-changed="handleFilterChange"
		/>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			currentFilter: {
				styles: [],
			} as FilterOptions,
		};
	},
	props: {
		filterOptions: {
			type: Object as PropType<FilterOptions>,
			required: true,
		},
	},
	methods: {
		handleFilterChange(filter: FilterOptions) {
			if (filter.styles) {
				this.currentFilter.styles = filter.styles;
			}
			this.$emit("filterChanged", this.currentFilter);
		},
	},
});
</script>

<style scoped>
div {
	border: 1px solid grey;
}
.filter-title {
	font-size: 1.5rem;
	font-weight: bold;
}
</style>
