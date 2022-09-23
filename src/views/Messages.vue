<script setup lang="ts">
import router from "@/router";
import type {
	Conversation,
	ConversationWithNames,
	Message,
	MessageWithName,
	UserWithID,
} from "@/types";
import { getAuth } from "@firebase/auth";
import {
	addDoc,
	collection,
	CollectionReference,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	Timestamp,
	where,
} from "@firebase/firestore";
import { defineComponent } from "vue";
import MessageFeed from "../components/Messaging/MessageFeed.vue";
</script>

<template>
	<div class="main-container">
		<div class="content-container">
			<header>
				<h1>Messages</h1>
			</header>
			<main>
				<aside>
					<div
						class="conversation-label"
						:class="{
							selected:
								conversation.id === selectedConversation.id,
						}"
						@click="selectedConversation = conversation"
						v-for="conversation in conversations"
					>
						{{ conversation.memberNames.join(", ") }}
					</div>
				</aside>
				<div class="message-feed">
					<MessageFeed
						:message-ref="selectedConversation.messageRef"
					/>
				</div>
			</main>
		</div>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			conversations: [] as ConversationWithNames[],
			selectedConversation: {} as ConversationWithNames,
			messageInput: "",
		};
	},
	methods: {
		async getMembersLabel(conversation: Conversation) {
			let membersParsed: string[] = [];

			for (const memberID of conversation.members) {
				if (memberID !== getAuth().currentUser?.uid) {
					let memberName = await this.getNameFromID(memberID);
					console.log(memberName);
					membersParsed.push(memberName);
				}
			}

			return membersParsed.join(", ");
		},
		async getNameFromID(uid: string): Promise<string> {
			let user = await getDoc(doc(getFirestore(), "users", uid));

			let data = user.data();

			if (data) {
				return data.name;
			}

			console.log("Didn't find user with ID: " + uid);
			return "";
		},
	},
	async created() {
		let currentUser = getAuth().currentUser;

		if (!currentUser) {
			router.push("/");
			return;
		}

		const q = query(
			collection(getFirestore(), "conversations"),
			where("members", "array-contains", currentUser.uid)
		);

		let conversations = await getDocs(q);

		conversations.forEach(async (conversation) => {
			let members = conversation.data().members as string[];
			let memberNames: string[] = [];

			for (const memberID of members) {
				memberNames.push(await this.getNameFromID(memberID));
			}

			this.conversations.push({
				members: members,
				messageRef: collection(
					getFirestore(),
					"conversations",
					conversation.id,
					"messages"
				),
				memberNames: [...memberNames],
				id: conversation.id,
			});

			if (this.conversations.length === 1) {
				this.selectedConversation = this.conversations[0];
			}
		});

		onSnapshot(q, (conversations) => {
			if (this.conversations.length === 0) return;
			this.conversations = [];
			conversations.forEach(async (conversation) => {
				let members = conversation.data().members as string[];
				let memberNames: string[] = [];

				for (const memberID of members) {
					memberNames.push(await this.getNameFromID(memberID));
				}

				this.conversations.push({
					members: members,
					messageRef: collection(
						getFirestore(),
						"conversations",
						conversation.id,
						"messages"
					),
					memberNames: [...memberNames],
					id: conversation.id,
				});
				if (conversation.id === this.selectedConversation.id) {
					this.selectedConversation = {
						members: members,
						messageRef: collection(
							getFirestore(),
							"conversations",
							conversation.id,
							"messages"
						),
						memberNames: [...memberNames],
						id: conversation.id,
					};
				}
			});
		});
	},
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
	display: grid;
	grid-template-rows: auto 1fr;
	height: 95%;
	width: clamp(13rem, 70%, 56rem);
	background-color: whitesmoke;
	border-radius: 3rem;
	padding: 2rem;
}

main {
	display: grid;
	grid-template-columns: 1fr 2fr;
	border: solid 1px gray;
	height: 75vh;
}

aside {
	border-right: solid 1px gray;
}

.conversation-label {
	text-align: center;
	font-weight: bold;
	border-bottom: solid 1px gray;
	background-color: lightgray;
}

.conversation-label:hover {
	background-color: rgb(224, 223, 223);
	cursor: pointer;
}

.selected {
	background-color: white;
}

.selected:hover {
	background-color: white;
	cursor: default;
}

.message-feed {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
	overflow: hidden;
	height: 100%;
}
</style>
