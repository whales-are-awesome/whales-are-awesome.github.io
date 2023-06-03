<template>
    <BaseLayer
        :class="classes.root"
        :id="id"
        :close-on-click-outside="closeOnClickOutside"
        :theme-settings="{
            container: classes.rootContainer
        }"
    >
        <p :class="classes.title" v-html="title"></p>
        <div :class="classes.buttons">
            <button
                @click="accept"
            >
                {{ buttonText }}
            </button>
            <button
                v-if="cancelButtonText"
                @click="close(props.id, false);"
            >
                {{ cancelButtonText }}
            </button>
        </div>
    </BaseLayer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useLayer from '@/composables/useLayer';
import BaseLayer from '@/components/Layers/BaseLayer/BaseLayer.vue';
import ThemeSettings from '@/types/themeSettings';
import makeClasses from '@/helpers/makeClasses';


// META

export interface IProps {
    id: string
    title: string
    cancelButtonText?: string
    closeOnClickOutside?: boolean
    buttonText: string
    themeSettings?: ThemeSettings<'root' | 'text'>
}

const props = withDefaults(defineProps<IProps>(), {
    cancelButtonText: 'Cancel',
    closeOnClickOutside: true
});

const { close } = useLayer();


// CLASSES

interface IThemeProps extends Pick<IProps, 'themeSettings'>{

}

const useClasses = makeClasses<IThemeProps>(() => ({
    root: ({ themeSettings }) => [themeSettings?.root,
        'p-2'
    ],
    rootContainer: 'py-4 px-8 flex flex-col base-animation-layer rounded-xl text-center md:p-6 bg-primary-500',
    preloader: '-preloader',
    icon: 'mb-11 flex justify-center',
    title: 'text-base text-white mb-3',
    text: ({ themeSettings }) => [themeSettings?.text,
        'text-400 mb-11'
    ],
    buttons: 'flex justify-center space-x-4 text-white'
}));

const classes = computed<ReturnType<typeof useClasses>>(() => {
    return useClasses({
        themeSettings: props.themeSettings
    });
});


// ACCEPT

async function accept() {
    close(props.id, true);
}
</script>
