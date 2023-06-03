<template>
    <Transition name="fade">
        <div
            v-if="isBlackoutShown"
            class="layer-blackout"
        >
        </div>
    </Transition>
    <Transition name="fade">
        <Component
            v-if="lastItem"
            :is="lastItem.component"
            :key="lastItem.id"
            v-bind="{
                ...lastItem.props,
                id: lastItem.id
            }"

        />
    </Transition>
</template>

<script lang="ts" setup>
import useLayer from '@/composables/useLayer';
import { computed } from 'vue';


// META

const { isBlackoutShown, openedItems } = useLayer();


// LAST ITEM

const lastItem = computed(() => openedItems.value.at(-1));
</script>

<style scoped>
.layer-blackout {
    @apply fixed top-0 left-0 right-0 bottom-0 transition-opacity duration-300 ease-out;
    transform-style: preserve-3d;
    background-color: rgba(24, 51, 79, 0.3);
    backdrop-filter: blur(8px);
    z-index: 9990;
}
</style>
