import {
    apiTypeKeys,
    batchRequest,
    IAddress,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {buildCustomerBatchRequest, buildAddressBatchRequest} from 'src/library';

export async function hydrateOrder(
    shippingAddress: IAddress,
    billingAddress: IAddress,
    firstName?: string,
    lastName?: string,
    emailAddress?: string): Promise<void> {
    const requests: Array<IBatchableRequest> = [];

    const customerRequest = buildCustomerBatchRequest(firstName || '', lastName || '', emailAddress || '');
    const shippingAddressRequest = buildAddressBatchRequest(shippingAddress, 'shipping');
    const billingAddressRequest = buildAddressBatchRequest(billingAddress, 'billing');

    customerRequest && requests.push(customerRequest);
    shippingAddressRequest && requests.push(shippingAddressRequest);
    billingAddressRequest && requests.push(billingAddressRequest);
    requests.push({apiType: apiTypeKeys.setTaxes, payload: {}});

    const batchResponse = await batchRequest(requests, API_RETRY);

    if (!batchResponse.success) {
        throw new Error('There was an error while validating your customer, shipping and billing information.');
    }
    return;
}
