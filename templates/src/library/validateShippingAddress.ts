import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getShippingAddress,
} from '@bold-commerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {generateTaxes, validateAddressFunction} from 'src/library';

export async function validateShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const address = getState().data.application_state.addresses.shipping;
    const libraryAddress = getShippingAddress();
    await dispatch(validateAddressFunction(Constants.SHIPPING, address, libraryAddress));
    const updatedAddress = getState().isValid.updatedShippingAddress;

    if(updatedAddress) {
        await dispatch(generateTaxes);
    }
}