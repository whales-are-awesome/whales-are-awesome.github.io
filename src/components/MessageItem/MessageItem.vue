<template>
    <div :class="classes.root">
        <div
            :class="classes.inner"
        >
            <div
                :class="classes.main"
            >
                <div v-html="text"></div>
                <Transition
                    name="fade-bounce"
                    mode="out-in"
                >
                    <div
                        v-if="reaction"
                        :key="reaction"
                        :class="classes.reaction"
                    >
                        <BaseIcon
                            :class="classes.reactionIcon"
                            :name="reaction"
                        />
                    </div>
                </Transition>
                <div
                    :class="classes.toggleBottom"
                    @click="showBottom = !showBottom"
                >
                    <BaseIcon
                        :class="classes.toggleBottomIcon"
                        name="chevron-down"
                        width="8"
                    />
                </div>
            </div>
            <BaseCollapse :show="showBottom">
                <div :class="classes.bottom">
                    <div :class="classes.reactions">
                        <div
                            v-for="item in reactionItems"
                            :key="item"
                            :class="[classes.reactionsItem, {
                                'bg-white bg-opacity-10 hover:bg-opacity-[0.15]': item === reaction
                            }]"
                            @click="setReaction(item === reaction ? '' : item)"
                        >
                            <BaseIcon
                                :class="classes.reactionsItemIcon"
                                :name="item"
                            />
                        </div>
                    </div>
                    <div
                        :class="classes.removeButton"
                        @click="remove"
                    >
                        <BaseIcon
                            :class="classes.removeButtonIcon"
                            name="cross"
                            width="8"
                        />
                    </div>
                </div>
            </BaseCollapse>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import BaseIcon from '@/components/BaseIcon/BaseIcon.vue';
import BaseCollapse from '@/components/BaseCollapse/BaseCollapse.vue';

import { INormalizedMessageAsMessenger } from '@/types/services/MessageService';

import makeClasses from '@/helpers/makeClasses';
import ThemeSettings from '@/types/themeSettings';


// META

interface IProps {
    isFromUser: INormalizedMessageAsMessenger['isFromUser']
    text: INormalizedMessageAsMessenger['text']
    reaction: INormalizedMessageAsMessenger['reaction']
    themeSettings?: ThemeSettings<'root'>
}

interface IEmits {
    (e: 'remove'): void
    (e: 'set-reaction', value: INormalizedMessageAsMessenger['reaction']): void
}

const emit = defineEmits<IEmits>();

const props = withDefaults(defineProps<IProps>(), {
});


// CLASSES

interface IThemeProps extends Pick<IProps, 'isFromUser' | 'themeSettings'>{
    showBottom: boolean
}

const useClasses = makeClasses<IThemeProps>(() => ({
    root: ({ themeSettings }) => [themeSettings?.root],
    inner: ({ isFromUser }) => [
        'transition-fast max-w-[70%] inline-block p-2 rounded-xl text-white relative',
        {
            'bg-primary-400': isFromUser,
            'bg-[#213040]': !isFromUser
        }
    ],
    main: ({ isFromUser }) => [
        'flex break-words text-sm',
        {
            'justify-end': isFromUser,
        }
    ],
    reaction: 'ml-2 flex-shrink-0 self-end',
    reactionIcon: 'w-[15px] h-[15px]',
    toggleBottom: 'flex items-center justify-center rounded-full cursor-pointer w-[20px] h-[20px] bg-white bg-opacity-10 flex-shrink-0 ml-2 transition-fast hover:bg-opacity-[0.15]',
    toggleBottomIcon: ({ showBottom }) => [
        'fill-white',
        {
            'scale-y-[-1]': showBottom
        }
    ],
    bottom: 'flex items-start justify-between pt-2 mt-2 border-t border-white border-opacity-20',
    reactions: 'transition-fast flex flex-wrap -mx-1 -mt-2',
    reactionsItem: 'w-[25px] h-[25px] flex flex-shrink-0 items-center justify-center cursor-pointer mx-1 mt-2 transition-fast rounded-full',
    reactionsItemIcon: 'w-[20px] h-[20px]',
    removeButton: 'flex items-center justify-center rounded-full cursor-pointer w-[25px] h-[25px] bg-white bg-opacity-10 flex-shrink-0 transition-fast ml-8 hover:bg-opacity-[0.15]',
    removeButtonIcon: 'fill-white'
}));

const classes = computed<ReturnType<typeof useClasses>>(() => {
    return useClasses({
        themeSettings: props.themeSettings,
        isFromUser: props.isFromUser,
        showBottom: showBottom.value
    });
});


// META: SHOW BOTTOM

const showBottom = ref(false);


// REACTION

const reactionItems: INormalizedMessageAsMessenger['reaction'][] = [
    'emoji-heart',
    'emoji-heart-broken',
    'emoji-thumb-up',
    'emoji-thumb-down',
    'emoji-anxious',
    'emoji-clown',
    'emoji-cry',
    'emoji-explosion',
    'emoji-tears'
];

function setReaction(reaction: INormalizedMessageAsMessenger['reaction']) {
    showBottom.value = false;
    emit('set-reaction', reaction);
}


// REMOVE

function remove() {
    emit('remove');
}
</script>

<style scoped>
.fade-bounce-enter-active, .fade-bounce-leave-active {
    transition: all .3s;
}
.fade-bounce-enter-from, .fade-bounce-leave-to  {
    opacity: 0;
    transform: scale(0.7);
}
</style>
