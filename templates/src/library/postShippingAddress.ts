import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    setShippingAddress,
    IApiReturnObject,
    getShippingAddress,
    IAddress,
} from '@bold-commerce/checkout-frontend-library';
import {actionSetAppStateValid} from 'src/action';
import {Constants, defaultAddressState} from 'src/constants';
import {setShippingAddressAsValid} from 'src/library';
import {compareAddresses, handleErrorIfNeeded} from 'src/utils';

export async function postShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    dispatch(actionSetAppStateValid('shippingAddress', false));
    const previousShipping: IAddress = getShippingAddress();
    const {data: {application_state: {addresses: {shipping}}}} = getState();

    // Not making request if shipping address is same as previous one but allowing it if they are the same
    // but the previousAddress is the same as the default one
    if (
        compareAddresses(shipping, previousShipping) &&
        !compareAddresses(previousShipping, defaultAddressState)
    ) {
        dispatch(actionSetAppStateValid('shippingAddress', true));
        return;
    }

    const _shipping = {...shipping};
    delete _shipping.id;

    const response: IApiReturnObject = await setShippingAddress(_shipping);
    handleErrorIfNeeded(response, dispatch, getState, Constants.SHIPPING);
    dispatch(setShippingAddressAsValid);
}
