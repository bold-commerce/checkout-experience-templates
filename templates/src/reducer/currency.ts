import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ICurrency} from '@bold-commerce/checkout-frontend-library';

const {data:{application_state: {currency}}} = defaultOrderInitialization;

export const currencyReducer = (state = currency): ICurrency => state;
