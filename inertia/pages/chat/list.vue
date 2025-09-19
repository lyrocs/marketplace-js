<script setup lang="ts">
import * as sdk from "matrix-js-sdk";
import { onMounted, ref, computed, nextTick, useTemplateRef } from "vue";
import UserDto from "#dtos/user";
import DiscussionDto from "#dtos/discussion";

class DiscussionWithMessages extends DiscussionDto {
    messages?: Array<{ sender: string; body: string; ts: number }>
}

const props = defineProps<{
    user: UserDto;
    matrixHost: string;
    discussions: DiscussionWithMessages[];
}>();
const user = props.user;
let accessToken: string | null = null;
let client: any | null = null;

let discussionsWithMessages = ref<DiscussionWithMessages[]>(props.discussions);

let conversations = ref<any[]>([]);

let selectedRoom = ref<string | null>(null);

let newMessage = ref('');

const currentRoom = computed(() => {
    if (!selectedRoom.value) {
        return null;
    }
    return discussionsWithMessages.value.find((room) => room.matrixRoomId === selectedRoom.value) || null;
});

const loginMatrix = async () => {
    if (!user?.matrixLogin || !user?.matrixPassword) {
        console.log('No matrix login or password');
        return;
    }
    const response = await fetch(`https://${props.matrixHost}/_matrix/client/v3/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: 'm.login.password',
            user: props.user?.matrixLogin!,
            password: user?.matrixPassword,
        }),
    });

    const data: any = await response.json();
    if (!response.ok) {
        console.error('Login failed:', data);
        return;
    }
    accessToken = data.access_token;
};

const listenNewMessage = (client: any) => {
    client.on(sdk.RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
        if (toStartOfTimeline) {
            return; // don't print paginated results
        }
        if (event.getType() !== 'm.room.message') {
            return; // only print messages
        }

        const existingDiscussion = discussionsWithMessages.value.find(d => d.matrixRoomId === room.roomId);
        if (existingDiscussion) {
            if (!existingDiscussion.messages) {
                existingDiscussion.messages = [];
            }
            existingDiscussion.messages.push({
                sender: event.getSender(),
                body: event.getContent().body,
                ts: event.getTs(),
            });
        }
    });
};

const sendMessage = () => {
    if (!client || !selectedRoom.value || !newMessage.value) {
        return;
    }
    client.sendEvent(selectedRoom.value, sdk.EventType.RoomMessage, {
        body: newMessage.value,
        msgtype: sdk.MsgType.Text,
    });
    newMessage.value = '';
};

const initMatrix = () => {
    const newClient = sdk.createClient({
        baseUrl: `https://${props.matrixHost}`,
        accessToken: accessToken!,
        userId: props.user?.matrixLogin!,
    });

    newClient.once('sync', (state: any, prevState: any, res: any) => {
        if (state === 'PREPARED') {
            const rooms = newClient.getRooms();
            rooms.forEach(room => {
                const messages = room.timeline?.filter(i => i.getType() === 'm.room.message').map(event => ({
                    sender: event.getSender()!,
                    body: event.getContent().body,
                    ts: event.getTs(),
                })) || [];
                const existingDiscussion = discussionsWithMessages.value.find(d => d.matrixRoomId === room.roomId);
                if (existingDiscussion) {
                    existingDiscussion.messages = messages;
                }
                // } else {
                //     discussionsWithMessages.value.push({
                //         matrixRoomId: room.roomId,
                //         name: room.name,
                //         messages: messages,
                //     });
                // }
            });
            const firstRoom = rooms[0];
            onSelectRoom(firstRoom.roomId);
            listenNewMessage(newClient);
            client = newClient;
        }
    });

    newClient.on('RoomMember.membership', (event, member) => {
        if (
            member.userId === newClient.getUserId()
            && member.membership === 'invite'
        ) {
            newClient.joinRoom(member.roomId).then(() => {
                console.log(`Joined room ${member.roomId} automatically`);
                // todo CAll geRooms()
            }).catch((err) => {
                console.error(`Failed to join room ${member.roomId}:`, err);
            });
        }
    });

    newClient.startClient();
}

const onSelectRoom = (roomId: string) => {
    selectedRoom.value = roomId;
};

onMounted(async () => {
    await loginMatrix();
    if (!accessToken) {
        return;
    }
    initMatrix();
});
</script>

<template>
    <main class="container mx-auto">
        <div class="bg-white rounded-xl shadow-lg h-[85vh] flex flex-col overflow-hidden">
            <div class="p-4 border-b flex justify-between items-center flex-shrink-0">
                <h1 class="text-2xl font-bold text-gray-800">Messagerie</h1>
                <!-- {{ discussionsWithMessages }} -->

            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 h-full overflow-hidden">
                <div class="md:col-span-1 border-r flex flex-col h-full bg-slate-50/50">
                    <div class="p-4 border-b flex-shrink-0"><input type="search" placeholder="Rechercher..."
                            class="w-full border-gray-300 rounded-md shadow-sm focus:border-slate-500 focus:ring-slate-500">
                    </div>
                    <div class="flex-grow overflow-y-auto">
                        <div v-for="conversation in discussionsWithMessages" :key="conversation.matrixRoomId"
                            class="p-4 flex gap-4 cursor-pointer "
                            :class="{ 'bg-slate-100 border-l-4 border-slate-700 bg-white ': selectedRoom === conversation.matrixRoomId }"
                            @click="onSelectRoom(conversation.matrixRoomId)">
                            <!-- <img :src="`https://i.pravatar.cc/48?u=${conversation.deal.title}`"
                                class="w-12 h-12 rounded-full" alt="avatar"> -->
                            <div class="w-full overflow-hidden">
                                <div class="flex justify-between items-baseline">
                                    <p class="font-bold text-gray-800 truncate">{{ conversation.deal.title }}</p><span
                                        class="text-xs text-gray-500 flex-shrink-0">{{ new
                                            Date(conversation?.messages?.[conversation.messages?.length -
                                                1]?.ts ?? 0).toLocaleString() }}</span>
                                </div>
                                <!-- <p class="text-sm font-semibold text-gray-600 truncate">{{ conversation.deal.title }}
                                </p> -->
                                <p class="text-sm text-gray-500 truncate">{{
                                    conversation?.messages?.[conversation.messages?.length - 1]?.body }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="currentRoom" class="md:col-span-3 flex flex-col h-full overflow-y-auto">
                    <div class="p-4 border-b flex items-center gap-4 flex-shrink-0 bg-white">
                        <!-- <img src="https://i.pravatar.cc/48?u=marc" alt="avatar" class="w-12 h-12 rounded-full"> -->
                        <div>
                            <p class="font-bold text-lg text-gray-800">{{ currentRoom?.buyer.id === user?.id ?
                                currentRoom?.seller.name : currentRoom?.buyer.name }}</p>
                        </div>
                        <div class="ml-auto flex items-center gap-3 border-l pl-4">
                            <img src="https://placehold.co/100x100/64748b/white?text=product"
                                class="w-12 h-12 rounded-md object-cover" alt="produit">
                            <div>
                                <p class="font-semibold text-gray-700">{{ currentRoom?.deal.title }}</p>
                                <p class="text-gray-500">{{ currentRoom?.deal.price }} €</p>
                            </div>
                            <a href="#" class="ml-2 text-slate-400 hover:text-slate-700"
                                title="Voir l'annonce"><ion-icon name="arrow-forward-circle-outline"
                                    class="text-2xl"></ion-icon></a>
                        </div>
                    </div>
                    <div class="flex-grow flex flex-col-reverse p-6 space-y-6 overflow-y-auto bg-slate-50">
                        <div v-for="message in currentRoom?.messages.reverse() || []" :key="message.id"
                            class="flex items-end gap-3"
                            :class="{ 'justify-end': message.sender === user?.matrixLogin }">
                            <!-- <img src="https://i.pravatar.cc/32?u=marc" class="w-8 h-8 rounded-full flex-shrink-0"
                                alt="avatar"> -->
                            <div class="rounded-bl-lg p-3 rounded-2xl shadow-sm max-w-lg border border-gray-200"
                                :class="{ ' bg-slate-700 text-white': message.sender === user?.matrixLogin, 'bg-white text-gray-800': message.sender !== user?.matrixLogin }">
                                <p class="text-sm">{{ message.body }}</p>
                                <p class="text-right text-xs mt-1">{{ new
                                    Date(message.ts).toLocaleString() }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t bg-white flex-shrink-0">
                        <form class="flex items-center gap-3" @submit.prevent="sendMessage">
                            <Textarea v-model="newMessage" placeholder="Écrivez votre message..." rows="1"
                                class="w-full border-gray-300 rounded-full shadow-sm focus:border-slate-500 focus:ring-slate-500 resize-none p-3"></Textarea>
                            <Button type="submit"
                                class="bg-slate-700 text-white rounded-full p-3 h-12 w-12 flex-shrink-0 hover:bg-slate-800 transition-colors flex items-center justify-center">
                                <ion-icon name="paper-plane-outline" class="text-xl"></ion-icon>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>