import {AnyAction} from 'redux';
import * as CustomerActionsType from '../action/customerActionType';
import {IApplicationStateCustomer} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';

const {data:{application_state}} = orderInitialization;

export function customerReducer(state = application_state.customer, action: AnyAction ) : IApplicationStateCustomer {
    switch (action.type) {
        case CustomerActionsType.UPDATE_CUSTOMER_EMAIL:
            return {...state, email_address: action.payload.email};
        case CustomerActionsType.UPDATE_CUSTOMER_FIELD:
            return {...state, [action.payload.field]: action.payload.value};
        case CustomerActionsType.UPDATE_CUSTOMER:
            return action.payload.customer;
        case CustomerActionsType.UPDATE_CUSTOMER_ACCEPT_MARKETING:
            return {...state, accepts_marketing: action.payload.value};
        default:
            return state;

    }
}
