<template>
    <transition
        enter-active-class="enter-active"
        leave-active-class="leave-active"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @before-leave="beforeLeave"
        @leave="leave"
        @after-leave="afterLeave"
    >
        <div v-show="show">
            <slot></slot>
        </div>
    </transition>
</template>

<script setup lang="ts">
// META

interface IProps {
    show: boolean
}

const props = withDefaults(defineProps<IProps>(), {
});


// HOOKS

let elementWidth = 0;

function beforeEnter(element: HTMLElement) {
    requestAnimationFrame(() => {
        if (!element.style.height) {
            elementWidth = element.scrollWidth;
            element.style.maxHeight = element.scrollHeight + 'px';
            element.style.height = '0px';
            element.style.width = '0px';
        }

        element.style.display = '';
    });
}

function enter(element: HTMLElement) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            element.style.height = `${ element.scrollHeight }px`;
            element.style.width = `${ elementWidth }px`;
        });
    });
}

function afterEnter(element: HTMLElement) {
    element.style.height = '';
    element.style.width = '';
    element.style.maxHeight = '';
}

function beforeLeave(element: HTMLElement) {
    requestAnimationFrame(() => {
        if (!element.style.height) {
            element.style.height = `${ element.offsetHeight }px`;
            element.style.width = `${ elementWidth }px`;
        }
    });
}

function leave(element: HTMLElement) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            element.style.height = '0px';
            element.style.width = '0px';
        });
    });
}

function afterLeave(element: HTMLElement) {
    element.style.height = '';
    element.style.width = '';
}
</script>

<style scoped>
.enter-active,
.leave-active {
    @apply transition-fast overflow-hidden;
}
</style>
