import { store } from '@/store';

function useError(status: number) {
    store.dispatch('error/setError', status);
}

export default useError;
