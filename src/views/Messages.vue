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
						v-for="conversation in conversations"
					>
						{{ conversation.memberNames.join(", ") }}
					</div>
				</aside>
				<div class="message-feed">
					<div
						class="message"
						v-for="message in selectedConversation.messages"
					>
						<span>
							<div class="message-timestamp">
								{{
									message.timestamp
										.toDate()
										.toLocaleDateString(undefined, {
											month: "numeric",
											day: "numeric",
											weekday: "short",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})
								}}
							</div>
							<span class="message-sender">{{
								message.senderName
							}}</span>
						</span>
						<span class="message-text">{{ message.text }}</span>
					</div>
					<form @submit.prevent="sendMessage">
						<input
							type="text"
							class="message-input"
							v-model="messageInput"
						/>
					</form>
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
		sendMessage() {
			if (this.messageInput.trim().length === 0) return;

			let user = getAuth().currentUser;
			if (!user) return;

			let message = {
				sender: user.uid,
				text: this.messageInput.trim(),
				timestamp: Timestamp.now(),
			};

			addDoc(
				collection(
					getFirestore(),
					"conversations",
					this.selectedConversation.id,
					"messages"
				),
				message
			);
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
			let messageQuery = query(
				collection(
					getFirestore(),
					"conversations",
					conversation.id,
					"messages"
				),
				orderBy("timestamp", "asc")
			);
			let messagesSnapshot = await getDocs(messageQuery);

			let messages = [] as MessageWithName[];
			messagesSnapshot.forEach((message) => {
				messages.push({
					sender: message.data().sender,
					text: message.data().text,
					timestamp: message.data().timestamp,
					senderName: "",
				});
			});

			let members = conversation.data().members as string[];
			let memberNames: string[] = [];

			for (const memberID of members) {
				memberNames.push(await this.getNameFromID(memberID));
			}

			for (const message of messages) {
				message.senderName = await this.getNameFromID(message.sender);
			}

			this.conversations.push({
				members: members,
				messages: [...messages],
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
				let messageQuery = query(
					collection(
						getFirestore(),
						"conversations",
						conversation.id,
						"messages"
					),
					orderBy("timestamp", "asc")
				);
				let messagesSnapshot = await getDocs(messageQuery);

				let messages = [] as MessageWithName[];
				messagesSnapshot.forEach((message) => {
					messages.push({
						sender: message.data().sender,
						text: message.data().text,
						timestamp: message.data().timestamp,
						senderName: "",
					});
				});

				let members = conversation.data().members as string[];
				let memberNames: string[] = [];

				for (const memberID of members) {
					memberNames.push(await this.getNameFromID(memberID));
				}

				for (const message of messages) {
					message.senderName = await this.getNameFromID(
						message.sender
					);
				}

				this.conversations.push({
					members: members,
					messages: [...messages],
					memberNames: [...memberNames],
					id: conversation.id,
				});
				if (conversation.id === this.selectedConversation.id) {
					this.selectedConversation = {
						members: members,
						messages: [...messages],
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
}

.selected {
	background-color: white;
}

.message-feed {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-end;
	overflow: hidden;
	height: 100%;
}

.message {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: solid 1px gray;
	border-bottom: solid 1px gray;
	padding: 0.5rem;
}

.message-text {
	margin-left: auto;
}

.message-input {
	width: 100%;
	font-size: 1.5rem;
}

.message-input:focus {
	outline: none;
}
</style>
