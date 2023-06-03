<template>
    <RouterView class="w-full" :key="$route.path + viewKeyCounter" />
    <Layers />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Layers from '@/components/Layers/Layers.vue';
import { store } from '@/store';
import useLayer from '@/composables/useLayer';


// META

const route = useRoute();

const hasError = computed(() => !!store.state.error.status);

const viewKeyCounter = computed(() => store.state.app.viewKey);

useLayer();


// ROUTE NAME

const routeName = computed(() => route.name);
</script>
