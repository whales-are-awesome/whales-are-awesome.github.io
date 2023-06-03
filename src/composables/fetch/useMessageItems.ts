import { useFetchDataWithTotal } from '@/composables/useFetchData';
import { INormalizedMessageAsMessenger, IMessageQuery } from '@/types/services/MessageService';
import MessageService from '@/services/MessageService';

function useMessageItems() {
    const items = useFetchDataWithTotal<INormalizedMessageAsMessenger>();

    fetchItems();
    async function fetchItems(offset = 0) {
        items.value.pending = true;
        items.value.cancel();

        const [data, error, cancel] = await MessageService.sampleItems.fetch({ offset }).messenger();

        if (error?.code === 'ERR_NETWORK') {
            error.message = 'Нет подключения к интернету';
        }

        if (!data && !error) {
            items.value.pending = false;

            await fetchItems(offset);

            return;
        }

        if (items.value.data && data) {
            items.value.data.items.push(...data.items);
            items.value.data.offset = data.offset;
        } else if (data) {
            items.value.data = data;
        }

        items.value = { ...items.value, pending: false, cancel, error };
    }

    return [items, fetchItems] as const;
}

export default useMessageItems;
