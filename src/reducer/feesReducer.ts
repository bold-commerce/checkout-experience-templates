import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {IFees} from '@boldcommerce/checkout-frontend-library';
import {AnyAction} from 'redux';
import {UPDATE_FEES} from 'src/action';

const {data:{application_state}} = defaultOrderInitialization;

export function feesReducer(state = application_state.fees, action: AnyAction ): Array<IFees> | undefined {
    switch (action.type) {
        case UPDATE_FEES: {
            return action.payload.data;
        }
        default:
            return state;
    }
}
