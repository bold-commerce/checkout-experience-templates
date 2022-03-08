import {useAppSelector} from 'src/hooks/rootHooks';
import {RootState} from 'src/index';

export function useGetAutocompleteService(): string {
    // Once settings received from endpoint, update this hook

    return useAppSelector((state: RootState) => state.appSetting.autocompleteService);
}
