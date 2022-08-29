<template>
	<div class="item-container">
		<div class="name-container">
			{{ musician.name }}
		</div>
		<ul class="instuments-container">
			<li v-for="instrument in musician.instruments" class="instrument">
				{{ capitalize(instrument) }}
			</li>
		</ul>
		<div class="name-container"></div>
	</div>
</template>

<script lang="ts">
import type { Musician } from "@/types";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	props: {
		musician: {
			type: Object as PropType<Musician>,
			required: true,
		},
	},
	methods: {
		capitalize(val: string): string {
			return val.charAt(0).toUpperCase() + val.slice(1);
		},
	},
});
</script>

<style>
.item-container {
	box-shadow: 5px 5px 10px;
	border: 1px solid gray;
	width: clamp(400px, 100%, 700px);
	padding: 16px;
}

.name-container {
	font-size: 2rem;
	font-weight: bold;
	margin: 0.5rem;
}
</style>
