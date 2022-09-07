<script setup lang="ts">
import { defineComponent, capitalize } from "vue";
</script>

<template>
	<div class="sort-dropdown">
		<label>
			Sort by:
			<input
				class="dropdown-input"
				@focus="showOptions"
				@blur="exitInput"
				v-model="searchFilter"
			/>
		</label>

		<div class="dropdown-content" v-show="optionsShow">
			<div
				v-for="option in filteredOptions"
				class="dropdown-item"
				@mousedown="selectOption(option)"
			>
				{{ capitalize(option) }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			searchFilter: "",
			selectedOption: "",
			options: ["likes", "level"],
			optionsShow: false,
			defaultOptionIndex: 0,
		};
	},
	methods: {
		showOptions() {
			this.searchFilter = "";
			this.optionsShow = true;
		},
		exitInput() {
			this.optionsShow = false;
			if (this.selectedOption === "") {
				this.searchFilter = "";
			} else {
				this.searchFilter = capitalize(this.selectedOption);
			}
			this.$emit("selected", this.selectedOption);
			this.optionsShow = false;
		},
		selectOption(option: string) {
			this.selectedOption = option;
			this.optionsShow = false;
			this.searchFilter = capitalize(this.selectedOption);
			this.$emit("selected", this.selectedOption);
		},
	},
	computed: {
		filteredOptions() {
			let filtered: string[] = [];
			let regOption = new RegExp(this.searchFilter, "ig");
			this.options.forEach((option) => {
				if (this.searchFilter.length === 0 || option.match(regOption)) {
					filtered.push(option);
				}
			});
			return filtered;
		},
	},
	mounted() {
		this.selectOption(this.options[this.defaultOptionIndex]);
	},
});
</script>

<style scoped>
.sort-dropdown {
	display: flex;
	flex-direction: column;
}
label {
	font-size: 1.3rem;
}
input {
	font-size: 1.3rem;
	height: 100%;
	width: 5rem;
	border: none;
}

.dropdown-content {
	align-self: flex-end;
	border: 1px solid gray;
	box-shadow: 3px 3px 5px black;
	position: absolute;
	top: 100%;
}

.dropdown-item {
	position: relative;
	padding: 0.5rem;
	border-bottom: 1px solid gray;
}
</style>
