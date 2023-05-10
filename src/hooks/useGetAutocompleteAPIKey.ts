import {useAppSelector} from './rootHooks';

export function useGetAutocompleteAPIKey(): string {
    return useAppSelector((state) =>  state.data.initial_data.general_settings.address_autocomplete.api_key);
}