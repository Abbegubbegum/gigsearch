<template>
	<div class="item-container">
		<div class="item-header">
			<div class="title-container">
				<div class="name-container">
					<img
						:src="
							'/src/assets/icons/' + user.instruments[0].iconName
						"
						alt="Instrument Icon"
						height="30"
					/>
					<span class="name">{{ user.name }}</span>
				</div>
				<div class="experience-container">
					Experience:
					<star-rating
						v-model:rating="user.experienceRating"
						:increment="0.01"
						:read-only="true"
						:show-rating="false"
						:star-size="30"
					/>
				</div>
			</div>
			<div class="header-end-container">
				<div class="location-container">
					<img
						src="../assets/icons/map-pin.svg"
						alt="Map pin icon"
						width="25"
					/>
					<span class="location-text">{{ user.location }}</span>
				</div>
				<div class="likes-container">{{ user.likes }}👍</div>
			</div>
		</div>
		<div class="item-main">
			<div class="lists-container">
				<ul class="instuments-container">
					<li
						v-for="instrument in user.instruments"
						class="instrument"
					>
						{{ capitalize(instrument.name) }}
					</li>
				</ul>
				<ul class="styles-container">
					<li v-for="style in user.styles" class="style">
						{{ capitalize(style) }}
					</li>
				</ul>
			</div>
			<div class="about-container">
				<p>{{ user.about }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import type { User } from "@/types";
import { defineComponent, type PropType } from "vue";
import StarRating from "vue-star-rating";

export default defineComponent({
	props: {
		user: {
			type: Object as PropType<User>,
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
	display: grid;
	grid-template-rows: auto;
}

.item-header {
	display: flex;
	padding: 0.5rem;

	justify-content: space-between;
	border-bottom: 1px solid gray;
}

.name-container {
	display: flex;
	align-items: center;
}

.name {
	font-size: 2rem;
	font-weight: bold;
	margin-left: 0.5rem;
}

.header-end-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.location-container {
	font-size: 1.5rem;
	text-align: center;
}

.location-text {
	margin: 0;
	padding: 0;
}

.likes-container {
	font-size: 1.5rem;
	text-align: right;
	font-weight: bold;
}

.item-main {
	display: grid;
	grid-template-columns: auto 1fr;
}

.lists-container {
	display: flex;
}

ul {
	list-style: circle;
	padding: 0 24px;
	font-size: 1.5rem;
	border-right: 1px solid gray;
}

li {
	font-weight: 500;
}

.about-container {
	padding: 0 1rem 1rem 1rem;
}
</style>
