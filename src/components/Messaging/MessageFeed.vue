<script setup lang="ts">
import type { MessageWithName } from "@/types";
import { getAuth } from "@firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	onSnapshot,
	onSnapshotsInSync,
	orderBy,
	query,
	Query,
	QuerySnapshot,
	Timestamp,
	type CollectionReference,
	type DocumentData,
} from "@firebase/firestore";
import { defineComponent, type PropType } from "vue";
</script>

<template>
	<div>
		<div class="messages">
			<div class="message" v-for="message in messages">
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
					<span class="message-sender">{{ message.senderName }}</span>
				</span>
				<span class="message-text">{{ message.text }}</span>
			</div>
		</div>
		<form @submit.prevent="sendMessage">
			<input type="text" class="message-input" v-model="messageInput" />
		</form>
	</div>
</template>

<script lang="ts">
export default defineComponent({
	data() {
		return {
			messages: [] as MessageWithName[],
			snapshotUnsub: () => {},
			messageInput: "",
		};
	},
	methods: {
		async getNameFromID(uid: string): Promise<string> {
			let user = await getDoc(doc(getFirestore(), "users", uid));

			let data = user.data();

			if (data) {
				return data.name;
			}

			console.log("Didn't find user with ID: " + uid);
			return "";
		},
		async fetchSnapshot() {
			console.log("fetchSnapshot");

			let messageQuery = query(this.messageRef, orderBy("timestamp"));
			this.updateMessages(await getDocs(messageQuery));
		},
		async updateMessages(snapshot: QuerySnapshot<DocumentData>) {
			let newMessages = [] as MessageWithName[];
			snapshot.forEach((message) => {
                newMessages.push({
                    
					sender: message.data().sender,
					text: message.data().text,
					timestamp: message.data().timestamp,
					senderName: "",
				} as MessageWithName);
			});

			for (const message of newMessages) {
				message.senderName = await this.getNameFromID(message.sender);
			}

			this.messages = [...newMessages];
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

			addDoc(this.messageRef, message);
			this.messageInput = "";
		},
	},
	props: {
		messageRef: {
			type: Object as PropType<CollectionReference>,
			required: true,
		},
	},
	watch: {
		messageRef(to, from) {
			console.log("Watcher!");
			console.log(to);

			this.snapshotUnsub();

			this.snapshotUnsub = onSnapshot(
				this.messageRef,
				this.fetchSnapshot
			);
		},
	},
});
</script>

<style scoped>
.messages {
	overflow-y: scroll;
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
