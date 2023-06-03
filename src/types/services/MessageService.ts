import { TMessage } from '@/types/entries/message';
import { TIcons } from '@/components/BaseIcon/types';
import { IPaginationParams } from '@/types/api';

interface IMessageQuery extends IPaginationParams {}

interface INormalizedMessageAsMessenger {
    id: number
    text: TMessage
    isDeleted: boolean,
    isFromUser: boolean
    reaction: TIcons | ''
}


export {
    TMessage,
    IMessageQuery,
    INormalizedMessageAsMessenger
}
