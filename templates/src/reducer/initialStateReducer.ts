import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ISupportedLanguage} from '@boldcommerce/checkout-frontend-library';

const {data:{initial_data}} = defaultOrderInitialization;

export function languageReducer(state = initial_data.supported_languages) : Array<ISupportedLanguage> {
    return state;
}

export const shopNameReducer = (state = initial_data.shop_name): string => state;
