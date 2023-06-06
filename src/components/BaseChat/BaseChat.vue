<template>
    <div>
        <div
            :class="classes.root"
        >
            <div
                :class="classes.messageItems"
                ref="itemsRef"
                v-scroll-at="onScrollTop"
            >
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
                <div :class="classes.states">
                    <div v-if="pending" :class="classes.preloader"></div>
                    <div v-else-if="error" :class="classes.error">
                        {{ error }}
                    </div>
                </div>
            </div>
            <BaseChatForm
                :class="classes.form"
                @submit="addMessage"
            />
        </div>
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
        'flex flex-col h-full w-full bg-primary-500 relative overflow-hidden'
    ],
    form: ({ themeSettings, isError }) => [themeSettings?.form,
        'w-full h-[60px] z-10 flex-shrink-0',
        {
            'pointer-events-none': isError
        }
    ],
    messageItems: 'flex-grow flex flex-col justify-start overflow-auto h-full rotate-180 [&>*]:scale-y-[-1] [&>*]:scale-x-[-1] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]',
    messageItemsInner: 'relative p-4',
    messageItem: 'w-full mb-1',
    preloader: '-preloader -preloader_sm -preloader_placeholder py-6',
    error: 'text-sm text-center py-2 ',
    states: 'my-auto h-0'
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

const itemsRef = ref<HTMLDivElement | null>(null);

onMounted(async () => {
    await wait(() => !!itemsRef.value);

    if (itemsRef.value) {
        await nextTick();
        itemsRef.value.scrollTop = 0;
    }

    if (!navigator.appVersion.includes('Win')) {
        console.log(itemsRef.value);
        itemsRef.value?.addEventListener('wheel', turnWheel);
    }
});

onUnmounted(() => {
    if (!navigator.appVersion.includes('Win')) {
        itemsRef.value?.removeEventListener('wheel', turnWheel)
    }
});

function turnWheel(e: WheelEvent) {
    e.stopPropagation();
    e.preventDefault();

    itemsRef.value?.scrollBy(0, -e.deltaY);
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
    itemsRef.value?.scrollTo({
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

    itemsRef.value?.dispatchEvent(new CustomEvent('scroll'));
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
