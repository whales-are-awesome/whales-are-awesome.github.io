import { markRaw  } from 'vue';
import { GetterTree, MutationTree, ActionTree  } from 'vuex';
import { Component } from '@vue/runtime-core';
import { IRootState } from './index';
import { createId } from '@/helpers/uuid';

interface ILayer {
    name: string
    id: string
    component: Component
    isOpened?: boolean
    props?: object
}

interface IState {
    items: ILayer[]
}

function state(): IState {
    const items: ILayer[] = [];

    return {
        items
    };
}

const getters: GetterTree<IState, any> = {
    layerById: (state) => (id: ILayer['id']) => {
        const find = state.items.find(item => item.id === id);

        return find;
    }
};

const mutations: MutationTree<IState> = {
    add(state, payload: ILayer) {
        const find = state.items.find(item => item.id === payload.id);

        if (find) return;

        state.items.push({
            ...payload,
            isOpened: false
        });
    },
    update(state, payload: ILayer) {
        const findIndex = state.items.findIndex(item => item.id === payload.id);

        if (~findIndex) {
            state.items.splice(findIndex, 1, {
                ...state.items[findIndex],
                ...payload
            });
        }
    },
    close(state, payload: ILayer['id']) {
        const find = state.items.find(item => item.id === payload);

        if (find) {
            find.isOpened = false;
        }
    },
};

const actions: ActionTree<IState, IRootState> = {
    async add({ commit, getters }, payload: string) {
        const find = getters['layerById'](payload);
        const id = payload + '-' + createId();
        let component: Component;


        if (!find) {
            component = await import('@/components/Layers/' + `${ payload }/${ payload }.vue`);

            commit('add', {
                id,
                name: payload,
                // @ts-ignore
                component: markRaw(component.default)
            });
        }

        return getters['layerById'](id);
    },
    async update({ commit }, payload: ILayer) {
        commit('update', payload);
    },
    async close({ commit }, payload: ILayer['id']) {
        commit('close', payload);
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
}

export {
    IState
}
