import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import layer, { IState as ILayerState } from './layer'
import isMobile, { IState as IIsMobileState } from './isMobile'
import error, { IState as IErrorState } from './error'
import app, { IState as IAppState } from './app'

export interface IRootState {
    layer: ILayerState
    isMobile: IIsMobileState
    error: IErrorState
    app: IAppState
}

export const key: InjectionKey<Store<IRootState>> = Symbol();

export const store = createStore<IRootState>({
    modules: {
        layer,
        isMobile,
        error,
        app
    }
});

export function useStore () {
    return baseUseStore(key);
}
