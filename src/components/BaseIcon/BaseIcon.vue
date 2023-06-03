<template>
    <!-- скачал какие-то кривые эмоджи, не работают через SvgSprite -->
    <img
        v-if="name.startsWith('emoji')"
        :src="require(`@/assets/sprite/svg/${ name }.svg`)"
        :alt="name"
    >
    <SvgSprite
        v-else
        class="transition-fast"
        :symbol="name"
        :size="size"
        @click="emit('click')"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { SvgSprite } from 'vue-svg-sprite';
import { TIcons } from './types';

// META

export interface IProps {
    name: TIcons
    width?: number | string
    height?: number | string
}

const props = withDefaults(defineProps<IProps>(), {
    width: 16
});

const emit = defineEmits(['click']);


// SIZE

const size = computed(() => `${ +props.width } ${ (props.height && +props.height) || +props.width }`);
</script>
