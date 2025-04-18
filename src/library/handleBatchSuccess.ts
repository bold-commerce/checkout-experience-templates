import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IApiSubrequestSuccessResponse
} from '@boldcommerce/checkout-frontend-library';
import {
    setShippingAddressAsValid,
    setBillingAddressAsValid,
    getCustomerFromLib,
    validateShippingLine,
    updateExternalPaymentGatewayShippingAddress,
    validateDiscounts,
    setShippingLineAsValid,
    setDefaultShippingLine,
    updateExternalPaymentGatewayBillingAddress,
} from 'src/library';
import {compareAddresses} from 'src/utils';
import {defaultAddressState} from 'src/constants';

export async function handleBatchSuccess(dispatch: Dispatch, getState: () => IOrderInitialization, subrequest: IApiSubrequestSuccessResponse): Promise<void> {
    const {data: {application_state: {addresses: {shipping, billing}}}} = getState();
    const shippingEmpty = compareAddresses(shipping, defaultAddressState);


    switch (subrequest.endpoint) {
        case '/customer/guest':
        case '/customer':
            await dispatch(getCustomerFromLib);
            await dispatch(validateDiscounts);
            break;
        case '/addresses/shipping':
            if (!shippingEmpty) {
                dispatch(setShippingAddressAsValid);
                dispatch(updateExternalPaymentGatewayShippingAddress(shipping));
            }
            break;
        case '/addresses/billing':
            dispatch(setBillingAddressAsValid);
            dispatch(updateExternalPaymentGatewayBillingAddress(billing));
            break;
        case '/shipping_lines':
            dispatch(setDefaultShippingLine);
            dispatch(setShippingLineAsValid);
            dispatch(validateShippingLine);
            break;
    }
}
