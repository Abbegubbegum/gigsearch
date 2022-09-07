<template>
	<div class="main-container">
		<div class="content-container">
			<div class="profile-header">
				<div class="name-title">
					<h1>{{ capitalize(user.name) }}</h1>
					<h2>@{{ user.username }}</h2>
					<h2 class="location-text">
						<img
							src="@/assets/icons/map-pin.svg"
							alt="Map pin icon"
							width="17"
						/>
						{{ user.location }}
					</h2>
				</div>
				<button v-if="authedUser" type="button" @click="showPopup">
					Edit Page
				</button>
			</div>
			<div class="item-container">
				<div>
					<h3>About</h3>
					<p>{{ user.about }}</p>
				</div>
			</div>
			<div class="item-container">
				<div>
					<h3>Instruments</h3>
					<ul>
						<li v-for="instrumentID in user.instruments">
							{{ capitalize(instruments[instrumentID].name) }}
						</li>
					</ul>
				</div>
				<div>
					<h3>Style</h3>
					<ul>
						<li v-for="style in user.styles">
							{{ capitalize(style) }}
						</li>
					</ul>
				</div>
			</div>
		</div>
		<EditPopup
			:show="editPopupShow"
			@close="editPopupShow = false"
			@edit="handleEdit"
			ref="editPopup"
		/>
	</div>
</template>

<script lang="ts">
import {
	getInstruments,
	getSessions,
	getUser,
	getUserFromSessionKey,
	putUser,
} from "@/main";
import router from "@/router";
import { defineComponent, capitalize } from "vue";
import type { Instrument, Session, User } from "@/types";
import EditPopup from "../components/EditPopup.vue";

export default defineComponent({
	data() {
		return {
			user: {} as User,
			authedUser: false,
			editPopupShow: false,
			instruments: [] as Instrument[],
		};
	},
	methods: {
		capitalize,
		showPopup() {
			this.editPopupShow = true;

			if (this.$refs.editPopup) {
				let ref: any = this.$refs.editPopup;
				ref.setValues(this.user);
			}
		},
		handleEdit(newUser: User) {
			this.user.name = newUser.name;
			this.user.location = newUser.location;
			this.user.about = newUser.about;
			this.user.styles = newUser.styles;
			this.user.instruments = newUser.instruments;

			putUser(this.user);

			this.editPopupShow = false;
		},
	},
	async created() {
		this.instruments = await getInstruments();

		let res = await getUser(parseInt(this.$route.params.uid.toString()));
		if (!res) {
			router.push("/404");
			return;
		}
		this.user = res;
		let localsessionKey = localStorage.getItem("sessionKey");
		if (!localsessionKey) return;
		let authedUser = await getUserFromSessionKey(localsessionKey);
		if (!authedUser) {
			localStorage.removeItem("sessionKey");
			return;
		}
		if (authedUser.id === this.user.id) {
			this.authedUser = true;
		}
	},
	components: { EditPopup },
});
</script>

<style scoped>
.main-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: lightgray;
}

.content-container {
	height: 95%;
	width: clamp(200px, 70%, 900px);
	border: 1px solid grey;
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

.profile-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

button {
	padding: 1rem;
}

h1 {
	font-size: 2.5rem;
	font-weight: bold;
}

h2 {
	color: grey;
	font-size: 1.3rem;
}

h3 {
	font-weight: bold;
}

ul {
	padding-left: 1rem;
}

.item-container {
	display: flex;
	margin: 1rem 0;
	gap: 2rem;
}

.location-text {
	margin: 0;
	padding: 0;
}
</style>
