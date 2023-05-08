import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getShippingAddress,
} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {validateAddressFunction} from 'src/library';

export async function validateShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const address = getState().data.application_state.addresses.shipping;
    const libraryAddress = getShippingAddress();
    await dispatch(validateAddressFunction(Constants.SHIPPING, address, libraryAddress));
}
