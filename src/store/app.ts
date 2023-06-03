import { MutationTree, ActionTree  } from 'vuex';
import { IRootState } from './index';

interface IState {
    viewKey: number
}

function state(): IState {
    return {
        viewKey: 0
    };
}

const mutations: MutationTree<IState> = {
    updateView: (state) => state.viewKey += 1,
};

const actions: ActionTree<IState, IRootState> = {
    updateView({ commit }) {
        commit('updateView');
    },
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
