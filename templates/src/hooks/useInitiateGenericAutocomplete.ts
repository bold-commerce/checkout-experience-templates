import {useGetAutocompleteService, useInitiateGoogleAutocomplete, useInitiateLoqate} from 'src/hooks';
import {autocompleteServices} from 'src/constants';

export function useInitiateGenericAutocomplete(): void {
    const autocompleteService = useGetAutocompleteService();
    switch (autocompleteService) {
        case autocompleteServices.LOQATE:
            useInitiateLoqate();
            break;
        case autocompleteServices.GOOGLE_AUTOCOMPLETE:
            useInitiateGoogleAutocomplete();
            break;
        default:
            break;
    }
}
