<template>
    <div :class="classes.root">
        <div
            :class="classes.wrapper"
            @click.self="closeLayer"
            @mousedown.self="mouseDown = true"
        >
            <div
                :class="[containerStyles, classes.container]"
                @click="mouseDown = false"
            >
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
</script>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import useLayer from '@/composables/useLayer';
import makeClasses from '@/helpers/makeClasses';
import { Position } from './types';
import ThemeSettings from '@/types/themeSettings';


// META

interface IProps {
    id: string
    containerStyles?: string
    position: Position
    closeOnClickOutside?: boolean
    themeSettings?: ThemeSettings<'root' | 'container'>
}

const props = withDefaults(defineProps<IProps>(), {
    position: 'center',
    closeOnClickOutside: true
});

const { close } = useLayer();


// CLASSES

interface IThemeProps extends Pick<IProps, 'position'> {
    themeSettings?: ThemeSettings<'container'>
}

const useClasses = makeClasses<IThemeProps>(() => ({
    root: () => [
        'fixed inset-0 min-h-screen z-[9998] overflow-x-hidden overflow-y-auto flex'
    ],
    wrapper: () => [
        'w-full flex',
    ],
    container: ({ themeSettings, position }) => [
        [themeSettings?.container, 'relative my-auto'],
        {
            'mx-auto': position === 'center',
            'ml-auto': position === 'right'
        }
    ]

}));

const classes = computed<ReturnType<typeof useClasses>>(() => {
    return useClasses({
        position: props.position,
        themeSettings: props.themeSettings,
    });
});


// CLOSE LAYER

const mouseDown = ref(false);

function closeLayer() {
    if (props.closeOnClickOutside && mouseDown.value) {
        close(props.id);
    }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    .modal-container {
        transition: opacity .5s;
    }
}
.fade-enter-from, .fade-leave-to  {
    opacity: 0;
    .modal-container {
        opacity: 0;
    }
}

.fade-enter-active .base-animation-layer, .fade-leave-active .base-animation-layer {
    @apply transition-fast;
}
.fade-enter-from .base-animation-layer, .fade-leave-to .base-animation-layer  {
    transform: scale(.95);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
