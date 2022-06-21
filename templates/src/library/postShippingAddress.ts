import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    setShippingAddress,
    updateShippingAddress,
    IApiReturnObject,
    getShippingAddress,
    IAddress
} from '@bold-commerce/checkout-frontend-library';
import {actionSetAppStateValid} from 'src/action';
import {Constants, defaultAddressState} from 'src/constants';
import {setShippingAddressAsValid} from 'src/library';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';

export async function postShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    dispatch(actionSetAppStateValid('shippingAddress', false));
    const previousShipping: IAddress = getShippingAddress();
    const {data: {application_state: {addresses: {shipping}}}} = getState();

    if (isObjectEquals(previousShipping, defaultAddressState) || (previousShipping.id !== shipping.id)) {
        const response: IApiReturnObject = await setShippingAddress(shipping);
        handleErrorIfNeeded(response, dispatch, getState, Constants.SHIPPING);
        dispatch(setShippingAddressAsValid);

    } else if (!isObjectEquals(previousShipping, shipping)) {
        const response: IApiReturnObject = await updateShippingAddress(shipping);
        handleErrorIfNeeded(response, dispatch, getState, Constants.SHIPPING);
        dispatch(setShippingAddressAsValid);
    }
}
