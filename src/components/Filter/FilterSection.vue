<script setup lang="ts">
import SelectionFilterGroup from "./SelectionFilterGroup.vue";
import { defineComponent, type PropType } from "vue";
import type { FilterOptions } from "@/types";
</script>

<template>
	<div class="filter-section">
		<span class="filter-title">Filter By:</span>
		<div class="group-container no-grid">
			<span class="group-header">Main Instrument Only?</span>
			<input
				type="checkbox"
				v-model="mainInstrumentOnly"
				class="single-checkbox"
			/>
		</div>
		<SelectionFilterGroup
			filter-label="Styles"
			:filter-options="filterOptions.styles"
			object-key="styles"
			@filter-changed="handleFilterChange"
		/>
		<SelectionFilterGroup
			filter-label="Locations"
			:filter-options="filterOptions.locations"
			object-key="locations"
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
				mainInstrumentOnly: false,
			} as FilterOptions,
			mainInstrumentOnly: false,
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
			if (filter.mainInstrumentOnly !== undefined) {
				this.currentFilter.mainInstrumentOnly =
					filter.mainInstrumentOnly;
			}
			if (filter.locations) {
				this.currentFilter.locations = filter.locations;
			}

			this.$emit("filterChanged", this.currentFilter);
		},
	},
	watch: {
		mainInstrumentOnly(to, from) {
			this.handleFilterChange({
				mainInstrumentOnly: this.mainInstrumentOnly,
			});
		},
	},
});
</script>

<style scoped>
.filter-section {
	border: 1px solid grey;
}

.group-container {
	border-top: 1px solid grey;
}

.filter-title {
	margin-left: 0.5rem;
	font-size: 1.5rem;
	font-weight: bold;
}

.no-grid {
	display: flex;
	align-items: center;
}

.single-checkbox {
	margin-left: 2rem;
}
</style>
