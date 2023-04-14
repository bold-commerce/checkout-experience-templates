import {IAddressAutoComplete, ICheckoutProcess} from 'src/types';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';

const {data: {initial_data}} = defaultOrderInitialization;

export function checkoutProcessReducer(state = initial_data.general_settings.checkout_process): ICheckoutProcess {
    return state;
}

export function addressAutoCompleteReducer(state = initial_data.general_settings.address_autocomplete): IAddressAutoComplete {
    return state;
}
