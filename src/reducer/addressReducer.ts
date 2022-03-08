import {AnyAction} from 'redux';
import * as CustomerActionsType from 'src/action/customerActionType';
import {IAddress} from 'src/types';
import {orderInitialization} from 'src/constants/orderInitialization';
import {defaultAddressState} from 'src/constants';

const {data:{application_state}} = orderInitialization;

export function shippingReducer(state = application_state.addresses.shipping, action: AnyAction ) : Partial<IAddress> {
    switch (action.type) {
        case CustomerActionsType.UPDATE_SHIPPING_ADDRESS_FIELD: {
            return {...state , [action.payload.field]: action.payload.value};
        }
        case CustomerActionsType.UPDATE_SHIPPING_SAVED_ADDRESS_FIELD:
        case CustomerActionsType.UPDATE_SHIPPING_ADDRESS:{
            return action.payload.data;
        }
        default:
            return state;

    }
}

export function billingReducer(state = application_state.addresses.billing, action: AnyAction ) : Partial<IAddress> {
    switch (action.type) {
        case CustomerActionsType.UPDATE_BILLING_ADDRESS_FIELD: {
            return {...state , [action.payload.field]: action.payload.value};
        }
        case CustomerActionsType.CLEAR_BILLING_INFO: {
            return defaultAddressState;
        }
        case CustomerActionsType.UPDATE_BILLING_SAVED_ADDRESS_FIELD:
        case CustomerActionsType.UPDATE_BILLING_ADDRESS:
        case CustomerActionsType.UPDATE_BILLING_AS_SHIPPING: {
            return action.payload.data;
        }
        case CustomerActionsType.UPDATE_BILLING_TYPE_SAME: {
            return application_state.addresses.shipping;
        }
        default:
            return state;

    }
}

