import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    apiTypeKeys,
    getShippingAddress,
    IAddress,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {actionSetAppStateValid} from 'src/action';
import {defaultAddressState} from 'src/constants';
import {compareAddresses} from 'src/utils';

export function getPayloadForPostShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): IBatchableRequest | null {
    const previousShipping: IAddress = getShippingAddress();
    const {data: {application_state: {addresses: {shipping}}}} = getState();
    const shippingNotChanged = compareAddresses(shipping, previousShipping);
    const previousShippingEmpty = compareAddresses(previousShipping, defaultAddressState);

    if (shippingNotChanged && !previousShippingEmpty) {
        dispatch(actionSetAppStateValid('shippingAddress', true));
        return null;
    }

    const _shipping = {...shipping};
    delete _shipping.id;

    return {apiType: apiTypeKeys.setShippingAddress, payload: _shipping};
}
