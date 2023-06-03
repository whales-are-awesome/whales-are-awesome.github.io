<template>
    <BaseChat
        :model-value="messages.data?.items"
        :pending="messages.pending"
        :error="messages.error?.message"
        class="mx-auto w-full max-w-[700px] h-screen"
        :theme-settings="{
            form: 'max-w-[700px]'
        }"
        :on-scroll-top="addMessages"
        :fetch-messages="fetchMessages"
        @update:model-value="messages.data.items = $event"
    />
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import useMessageItems from '@/composables/fetch/useMessageItems';
import BaseChat from '@/components/BaseChat/BaseChat.vue';
import wait from '@/helpers/wait';


const [messages, fetchMessages] = useMessageItems();

async function addMessages() {
    await wait(() => !messages.value.pending);

    if (messages.value.data?.items.length == messages.value.data?.total) {
        return
    }

    fetchMessages(messages.value.data!.offset + 20)
    await nextTick();

    return wait(() => !messages.value.pending);
}
</script>
