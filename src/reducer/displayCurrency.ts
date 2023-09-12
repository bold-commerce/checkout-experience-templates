import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ICurrency} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state: {display_currency}}} = defaultOrderInitialization;

export const displayCurrencyReducer = (state = display_currency): ICurrency | null => state;
