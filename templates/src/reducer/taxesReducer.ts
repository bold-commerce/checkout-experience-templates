import {AnyAction} from 'redux';
import {UPDATE_TAXES} from 'src/action';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {ITax} from '@boldcommerce/checkout-frontend-library';

const {data: {application_state}} = defaultOrderInitialization;

export function taxesReducer(state: Array<ITax> = application_state.taxes, action: AnyAction ): Array<ITax> {
    switch (action.type) {
        case UPDATE_TAXES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
