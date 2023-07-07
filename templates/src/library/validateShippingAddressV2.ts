import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getShippingAddress,
    IBatchableRequest,
} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {validateAddressFunctionV2} from 'src/library';

export function validateShippingAddressV2(dispatch: Dispatch, getState: () => IOrderInitialization): Array<IBatchableRequest> {
    const address = getState().data.application_state.addresses.shipping;
    const libraryAddress = getShippingAddress();
    return dispatch(validateAddressFunctionV2(Constants.SHIPPING, address, libraryAddress));
}
