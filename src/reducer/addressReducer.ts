import {AnyAction} from 'redux';
import * as CustomerActionsType from 'src/action/customerActionType';
import {defaultAddressState} from 'src/constants';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

const {data:{application_state}} = defaultOrderInitialization;

export function shippingReducer(state = application_state.addresses.shipping, action: AnyAction ): IAddress {
    switch (action.type) {
        case CustomerActionsType.UPDATE_SHIPPING_ADDRESS_FIELD: {
            return {...state , [action.payload.field]: action.payload.value} as IAddress;
        }
        case CustomerActionsType.UPDATE_SHIPPING_SAVED_ADDRESS_FIELD:
        case CustomerActionsType.UPDATE_SHIPPING_ADDRESS:{
            return action.payload.data;
        }
        default:
            return state;

    }
}

export function billingReducer(state = application_state.addresses.billing, action: AnyAction ): IAddress {
    switch (action.type) {
        case CustomerActionsType.UPDATE_BILLING_ADDRESS_FIELD: {
            return {...state , [action.payload.field]: action.payload.value} as IAddress;
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
            return action.payload.data;
        }
        default:
            return state;

    }
}

