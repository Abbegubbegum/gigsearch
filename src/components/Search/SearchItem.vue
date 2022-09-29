<script setup lang="ts">
import type { Instrument, InstrumentWithID, UserWithID } from "@/types";
import { capitalize, defineComponent, type PropType } from "vue";
import router from "@/router";
import {
	onSnapshot,
	collection,
	getFirestore,
	CollectionReference,
	type DocumentData,
	getDocs,
} from "@firebase/firestore";
</script>

<template>
	<div class="item-container" @click="handleClick">
		<div class="item-header">
			<div class="title-container">
				<div class="name-container">
					<img
						:src="'/' + getInstrument(user.instruments[0]).iconName"
						alt="Instrument Icon"
						height="30"
					/>
					<span class="name">{{ user.name }}</span>
				</div>
				<div class="experience-container">
					Level:
					<StarRating
						:rating="user.experienceRating"
						:increment="0.5"
						:read-only="true"
						:show-rating="false"
						:star-size="30"
					/>
				</div>
			</div>
			<div class="header-end-container">
				<div class="location-container">
					<img
						src="@/assets/map-pin.svg"
						alt="Map pin icon"
						width="25"
					/>
					<span class="location-text">{{ user.locationName }}</span>
				</div>
				<div class="likes-container">{{ user.likes }}👍</div>
			</div>
		</div>
		<div class="item-main">
			<div class="lists-container">
				<ul class="instuments-container">
					<li
						v-for="instrumentID in user.instruments"
						class="instrument"
					>
						{{ capitalize(getInstrument(instrumentID).name) }}
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
import StarRating from "vue-star-rating";

export default defineComponent({
	data() {
		return {
			instruments: [] as InstrumentWithID[],
		};
	},
	props: {
		user: {
			type: Object as PropType<UserWithID>,
			required: true,
		},
	},
	methods: {
		capitalize,
		handleClick() {
			router.push("/profile/" + this.user.id);
		},
		getInstrument(instrumentID: string): Instrument {
			let instrument = this.instruments.find(
				(instrument) => instrument.id === instrumentID
			);

			return (
				instrument ||
				({ name: "Undefined", iconName: "" } as Instrument)
			);
		},
	},
	components: {
		StarRating,
	},
	created() {
		getDocs(collection(getFirestore(), "instruments")).then((snapshot) => {
			let newInstruments: InstrumentWithID[] = [];

			snapshot.forEach((doc) => {
				newInstruments.push({
					name: doc.data().name,
					iconName: doc.data().iconName,
					id: doc.id,
				});
			});
			this.instruments = [...newInstruments];
		});
	},
});
</script>

<style scoped>
.item-container {
	box-shadow: 5px 5px 5px;
	border: 1px solid gray;
	min-height: 20rem;
	max-height: 30rem;
	width: clamp(30rem, 100%, 45rem);
	display: grid;
	grid-template-rows: auto 1fr;
	transition: all 0.2s ease;
	overflow: hidden;
}

.item-container:hover {
	cursor: pointer;
	transform: scale(1.05);
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
	padding: 0 2rem;
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
