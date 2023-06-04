<template>
    <div>
        <div
            :class="classes.root"
            ref="root"
            v-scroll-at="onScrollTop"
        >
            <div :class="classes.formWrapper"></div>
            <div :class="classes.messageItems">
                <div v-if="pending" :class="classes.preloader"></div>
                <div v-if="error" :class="classes.error">
                    {{ error }}
                </div>
                <TransitionGroup
                    :class="classes.messageItemsInner"
                    tag="div"
                    name="list"
                >
                    <MessageItem
                        v-for="item in filteredItems"
                        :key="item.id"
                        :class="[classes.messageItem, {
                            'flex justify-end': item.isFromUser
                        }]"
                        :text="item.text"
                        :reaction="item.reaction"
                        :is-from-user="item.isFromUser"
                        @remove="removeMessage(item.id)"
                        @set-reaction="setReaction(item.id, $event)"
                    />
                </TransitionGroup>
            </div>
        </div>
        <BaseChatForm
            :class="classes.form"
            @submit="addMessage"
        />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, computed, onUnmounted } from 'vue';

import MessageItem from '@/components/MessageItem/MessageItem.vue';
import BaseChatForm from '@/components/BaseChat/BaseChatForm.vue';

import { INormalizedMessageAsMessenger } from '@/types/services/MessageService';
import ThemeSettings from '@/types/themeSettings';

import { confirm } from '@/composables/useLayer';

import makeClasses from '@/helpers/makeClasses';
import wait from '@/helpers/wait';


// META

interface IProps {
    modelValue: INormalizedMessageAsMessenger[]
    onScrollTop: () => Promise<any>
    fetchMessages: (offset: number) => Promise<any>
    error: string
    pending: boolean
    themeSettings?: ThemeSettings<'root' | 'form'>
}

interface IEmits {
    (e: 'update:modelValue', value: INormalizedMessageAsMessenger[]): void
}

const props = withDefaults(defineProps<IProps>(), {
});

const emit = defineEmits<IEmits>();


// CLASSES
interface IThemeProps extends Pick<IProps, 'themeSettings'>{
    isError: boolean
}

const useClasses = makeClasses<IThemeProps>(() => ({
    root: ({ themeSettings }) => [themeSettings?.root,
        'root flex flex-col h-full w-full bg-primary-500 relative overflow-y-auto rotate-180 [&>*]:scale-y-[-1] [&>*]:scale-x-[-1] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]'
    ],
    formWrapper: 'w-full h-[60px] flex-shrink-0',
    form: ({ themeSettings, isError }) => [themeSettings?.form,
        // sticky не дружит с нижним баром телефонов
        'w-full h-[60px] mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 h-[60px] z-10',
        {
            'pointer-events-none': isError
        }
    ],
    messageItems: 'flex-grow flex flex-col justify-end p-4',
    messageItemsInner: 'relative',
    messageItem: 'w-full mb-1',
    preloader: '-preloader -preloader_sm -preloader_placeholder my-auto',
    error: 'text-sm text-center'
}));

const classes = computed<ReturnType<typeof useClasses>>(() => {
    return useClasses({
        themeSettings: props.themeSettings,
        isError: !!props.error
    });
});


// META:VALUE

const value = computed({
    get() {
        return props.modelValue || [];
    },
    set(value: INormalizedMessageAsMessenger[]) {
        emit('update:modelValue', value)
    }
});

const filteredItems = computed(() => [...value.value].reverse().filter(item => !item.isDeleted));


// ROOT

const root = ref<HTMLDivElement | null>(null);

onMounted(async () => {
    await wait(() => !!root.value);

    if (root.value) {
        await nextTick();
        root.value.scrollTop = 0;
    }

    if (!navigator.appVersion.includes('Win')) {
        root.value?.addEventListener('wheel', turnWheel);
    }
});

onUnmounted(() => {
    if (!navigator.appVersion.includes('Win')) {
        root.value?.removeEventListener('wheel', turnWheel)
    }
});

function turnWheel(e: WheelEvent) {
    e.stopPropagation();
    e.preventDefault();

    root.value?.scrollBy(0, -e.deltaY);
}


// MESSAGES

async function addMessage(text: INormalizedMessageAsMessenger['text']) {
    if (props.error) {
        return;
    }

    value.value = [{
        id: value.value.length,
        text,
        isDeleted: false,
        isFromUser: true,
        reaction: ''
    }, ...value.value];


    await nextTick();
    root.value?.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

async function removeMessage(id: INormalizedMessageAsMessenger['id']) {
    const isDelete = await confirm({
        title: 'Удалить выбранное сообщение?',
        buttonText: 'Удалить',
        cancelButtonText: 'Отмена',
    });

    if (isDelete) {
        value.value = value.value.map(item => item.id === id
            ? { ...item, isDeleted: true }
            : item
        );
    }
}


// REACTION

async function setReaction(id: INormalizedMessageAsMessenger['id'], reaction: INormalizedMessageAsMessenger['reaction']) {
    value.value = value.value.map(item => item.id === id
        ? { ...item, reaction }
        : item
    );
}


// ONLINE LOAD IF ERROR

onMounted(() => window.addEventListener('online', onWentOnline));
onUnmounted(() => window.removeEventListener('online', onWentOnline));

function onWentOnline() {
    if (props.error && !value.value.length) {
        props.fetchMessages(0);
    }

    root.value?.dispatchEvent(new CustomEvent('scroll'));
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

.list-leave-active {
    position: absolute;
}
</style>
