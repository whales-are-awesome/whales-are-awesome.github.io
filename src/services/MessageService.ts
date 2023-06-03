import API from '@/helpers/api';
import { IResponsePagination } from '@/types/api';

import { IMessageQuery, TMessage, INormalizedMessageAsMessenger } from '@/types/services/MessageService';

export default class MessageService {
    static sampleItems = {
        fetch(params: IMessageQuery) {
            async function raw() {
                return API.get<IResponsePagination<TMessage>>('/getMessages', params);
            }

            async function messenger() {
                const [data, ...rest] = await raw();

                return [(data?.result || null) && {
                    items: normalizeMessagesAsMessenger(data!.result, params),
                    offset: params.offset,
                    total: 73
                }, ...rest] as const;
            }

            return {
                raw,
                messenger
            };
        }
    }
}

function normalizeMessagesAsMessenger(data: string[], params: IMessageQuery): INormalizedMessageAsMessenger[] {
    return data.map((item, index) => ({
        id: +index + params.offset,
        text: item,
        isDeleted: false,
        isFromUser: !(index % 4),
        reaction: ''
    }));
}
