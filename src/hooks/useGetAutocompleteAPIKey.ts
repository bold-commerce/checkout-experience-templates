import {autocompleteServices, GoogleAutocompleteConstants, LoqateConstants} from 'src/constants';

export function useGetAutocompleteAPIKey(type:autocompleteServices): string {
    let apiKey:string;

    switch(type){
        case(autocompleteServices.GOOGLE_AUTOCOMPLETE):
            apiKey = GoogleAutocompleteConstants.API_KEY;
            break;
        case(autocompleteServices.LOQATE):
            apiKey = LoqateConstants.API_KEY;
            break;
        default:
            apiKey = '';
    }
    return apiKey;
}