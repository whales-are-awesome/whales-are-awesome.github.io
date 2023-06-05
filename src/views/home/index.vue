<template>
    <BaseChat
        class="mx-auto w-full max-w-[700px] h-screen"
        :pending="messages.pending"
        :error="messages.error?.message"
        :on-scroll-top="addMessages"
        :fetch-messages="fetchMessages"
        :model-value="messages.data?.items"
        @update:model-value="messages.data.items = $event"
    />
</template>

<script lang="ts" setup>
import useMessageItems from '@/composables/fetch/useMessageItems';
import BaseChat from '@/components/BaseChat/BaseChat.vue';


const [messages, fetchMessages, addMessages] = useMessageItems();
</script>
