<template>
    <Component
        :is="currentLayout"
        :key="currentLayout"
    >
        <slot></slot>
    </Component>
</template>

<script setup lang="ts">
import DefaultLayout from './default.vue';

import { computed } from 'vue';
import { useRoute } from 'vue-router'

const currentLayout = computed(() => {
    const name = ((useRoute()).meta.layout || 'default') as string;
    const components = {
        DefaultLayout
    };
    const componentName: keyof typeof components = name[0].toUpperCase() + name.slice(1) + 'Layout';

    return components[componentName];
});
</script>
