import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetSelectedLanguageIso(): string {
    return useAppSelector((state) => state.data.application_state.order_meta_data.note_attributes._language_iso_code);
}
