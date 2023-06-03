import { MutationTree, ActionTree  } from 'vuex';
import { IRootState } from './index';

interface IState {
    status: number | null
}

function state(): IState {
    return {
        status: null
    };
}

const mutations: MutationTree<IState> = {
    setError(state, payload: IState['status']) {
        state.status = payload;
    },
    removeError(state) {
        state.status = null;
    },
};

const actions: ActionTree<IState, IRootState> = {
    async setError({ commit }, payload: IState['status']) {
        commit('setError', payload);
    },
    async removeError({ commit }) {
        commit('removeError');
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
