import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    setShippingAddress,
    IApiReturnObject,
    getShippingAddress,
    IAddress,
} from '@boldcommerce/checkout-frontend-library';
import {actionSetAppStateValid} from 'src/action';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';
import {setShippingAddressAsValid, updateExternalPaymentGatewayShippingAddress} from 'src/library';
import {compareAddresses, handleErrorIfNeeded} from 'src/utils';

export async function postShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const previousShipping: IAddress = getShippingAddress();
    const {data: {application_state: {addresses: {shipping}}}} = getState();
    const shippingNotChanged = compareAddresses(shipping, previousShipping);
    const previousShippingEmpty = compareAddresses(previousShipping, defaultAddressState);
    const shippingEmpty = compareAddresses(shipping, defaultAddressState);
    
    // Not making request if shipping address is same as previous one but allowing it if they are the same
    // but the previousAddress is the same as the default one
    if (shippingNotChanged && !previousShippingEmpty) {
        dispatch(actionSetAppStateValid('shippingAddress', true));
        return;
    }

    const _shipping = {...shipping};
    delete _shipping.id;

    const response: IApiReturnObject = await setShippingAddress(_shipping, API_RETRY);

    if (!shippingEmpty) {
        handleErrorIfNeeded(response, dispatch, getState, Constants.SHIPPING);
        dispatch(setShippingAddressAsValid);
    }

    if (response.success) {
        dispatch(updateExternalPaymentGatewayShippingAddress(shipping));
    }
}
