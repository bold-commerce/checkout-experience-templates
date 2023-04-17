import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetNoteAttributes(): Record<string, string> {
    return useAppSelector((state) => state.data.application_state.order_meta_data.note_attributes);
}
