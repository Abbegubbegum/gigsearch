<template>
	<div class="item-container">
		<div class="item-header">
			<div class="title-container">
				<div class="name-container">
					<img
						:src="
							'/src/assets/icons/' +
							musician.instruments[0].iconName
						"
						alt="Instrument Icon"
						height="40"
					/>
					{{ musician.name }}
				</div>
				<div class="rating-container">
					<star-rating
						v-model:rating="musician.rating"
						:increment="0.01"
						:read-only="true"
						:show-rating="false"
						:star-size="30"
					/>
				</div>
			</div>
			<div class="location-container">
				<img
					src="../assets/icons/map-pin.svg"
					alt="Map pin icon"
					width="30"
				/>
			</div>
		</div>
		<div class="item-main">
			<div class="lists-container">
				<ul class="instuments-container">
					<li
						v-for="instrument in musician.instruments"
						class="instrument"
					>
						{{ capitalize(instrument.name) }}
					</li>
				</ul>
				<ul class="styles-container">
					<li
						v-for="instrument in musician.instruments"
						class="instrument"
					>
						{{ capitalize(instrument.name) }}
					</li>
				</ul>
			</div>
			<div class="about-container">
				<p></p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { Musician } from "@/types";
import { defineComponent, type PropType } from "vue";
import StarRating from "vue-star-rating";

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
	components: {
		StarRating,
	},
});
</script>

<style>
.item-container {
	box-shadow: 5px 5px 5px;
	border: 1px solid gray;
	width: clamp(200px, 100%, 600px);
	padding: 0.5rem;
	display: grid;
	grid-template-rows: 1fr 2fr;
}

.item-header {
	display: flex;
	justify-content: space-between;
}

.name-container {
	font-size: 2rem;
	font-weight: bold;
}

.item-main {
	display: grid;
	grid-template-columns: 1fr 1fr;
}

.lists-container {
	display: flex;
}

ul {
	list-style: none;
	padding: 0;
	margin: 0.3rem;
}
</style>
