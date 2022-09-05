<script lang="ts" setup>
import { defineComponent, capitalize } from "vue";
</script>

<template>
	<div class="group-container">
		<div class="group-header">
			{{ capitalize(filterLabel) }}:
			<input
				type="text"
				class="filter-searchbar"
				v-model="search"
				@input="updateSearch"
			/>
		</div>
		<div class="button-group">
			<div class="option-button" v-for="option in searchedOptions">
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
			search: "",
			checkedOptions: [] as String[],
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
		updateSearch() {},
	},
	computed: {
		searchedOptions() {
			if (!this.filterOptions) return;
			let options = [...this.filterOptions];
			options = options.filter((option) =>
				option.toLowerCase().includes(this.search.toLowerCase())
			);

			options.sort((a, b): number => {
				let aIsChecked = this.checkedOptions.includes(a);
				let bIsChecked = this.checkedOptions.includes(b);
				if ((aIsChecked && bIsChecked) || (!aIsChecked && !bIsChecked))
					return 0;
				else if (aIsChecked) return -1;
				else if (bIsChecked) return 1;

				return 0;
			});

			return options.slice(0, 12);
		},
	},
	watch: {
		checkedOptions(to, from) {
			this.applyFilter();
		},
	},
});
</script>

<style scoped>
.group-header {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.button-group {
	display: grid;
	grid-template-columns: 1fr 1fr;
}
</style>
