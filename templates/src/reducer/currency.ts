import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IApplicationStateCurrency} from 'src/types';

const {data:{application_state: {currency}}} = defaultOrderInitialization;

export const currencyReducer = (state = currency): IApplicationStateCurrency => state;
