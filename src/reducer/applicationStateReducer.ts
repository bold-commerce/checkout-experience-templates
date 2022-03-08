import {orderInitialization} from 'src/constants/orderInitialization';

const {data: {application_state}} = orderInitialization;

export const resumableLinkReducer = (state = application_state.created_via): string => state;

export const createdViaReducer = (state = application_state.created_via): string => state;
