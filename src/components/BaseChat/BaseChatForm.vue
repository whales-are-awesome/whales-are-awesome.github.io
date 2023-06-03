<template>
    <form
        :class="classes.root"
        @submit.prevent="onSubmit"
    >
        <input
            v-model="text"
            ref="input"
            :class="classes.textField"
            type="text"
            placeholder="Сообщение..."
        >
        <Transition name="fade">
            <button
                v-if="text"
                :class="classes.submitButton"
            >
                <BaseIcon
                    :class="classes.submitButtonIcon"
                    name="telegram"
                    width="30"
                />
            </button>
        </Transition>
    </form>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';

import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';

import { INormalizedMessageAsMessenger } from '@/types/services/MessageService';
import ThemeSettings from '@/types/themeSettings';

import makeClasses from '@/helpers/makeClasses';


// META

interface IProps {
    themeSettings?: ThemeSettings<'root'>
}

interface IEmits {
    (e: 'submit', value: INormalizedMessageAsMessenger['text']): void
}

const props = withDefaults(defineProps<IProps>(), {
});

const emit = defineEmits<IEmits>();


// CLASSES

interface IThemeProps extends Pick<IProps, 'themeSettings'>{
}

const useClasses = makeClasses<IThemeProps>(() => ({
    root: ({ themeSettings }) => [themeSettings?.root,
        'flex justify-between border-t border-[#1e2b3a] bg-primary-500 p-4'
    ],
    textField: 'flex-grow bg-transparent text-white placeholder:text-[#a1b1c4]',
    submitButton: 'text-white',
    submitButtonIcon: 'fill-white hover:fill-[#2ea6ff] rotate-[30deg]'
}));

const classes = computed<ReturnType<typeof useClasses>>(() => {
    return useClasses({
        themeSettings: props.themeSettings
    });
});


// INPUT

const input = ref<HTMLInputElement | null>(null);

onMounted(() => window.addEventListener('keydown', focus));
onUnmounted(() => window.removeEventListener('keydown', focus));

function focus() {
    input.value?.focus();
}


// TEXT

const text = ref('');

async function onSubmit() {
    if (!text.value) {
        return;
    }

    emit('submit', text.value);
    text.value = '';
}
</script>

<style scoped>
.fade-enter-from, .fade-leave-to  {
    transform: scale(0.8);
}
</style>
