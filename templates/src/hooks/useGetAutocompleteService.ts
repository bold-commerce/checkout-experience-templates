import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetAutocompleteService(): string {
    return useAppSelector((state) =>  state.data.initial_data.general_settings.address_autocomplete.provider);
}
