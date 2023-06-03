import { ActionTree, MutationTree } from 'vuex';
import { IRootState } from './index';

interface IState {
    width: number
}

function state(): IState {
    return {
        width: 0
    };
}

const mutations: MutationTree<IState> = {
    setWidth: (state, payload: IState['width']) => state.width = payload
};

const actions: ActionTree<IState, IRootState> = {
    setWidth({ commit }, payload: IState['width']) {
        commit('setWidth', payload);
    }
};

export default {
    state,
    mutations,
    actions,
    namespaced: true
}

export {
    IState
}
