import {
    IOnDeletePaymentMethodPayload,
    IOnDeletePaymentMethodResponse,
} from 'src/types';
import {deletePaymentMethod, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';

export async function onDeletePaymentMethod(payload: IOnDeletePaymentMethodPayload): Promise<IOnDeletePaymentMethodResponse> {
    const result: IApiReturnObject = await deletePaymentMethod(payload.public_id);
    if (!result.success || result.error !== null) {
        throw new Error(`Encountered error when attempting to delete saved payment method. Status: ${result.status}, Successful: ${result.success}, ErrorMessage: ${result.error?.message}`);
    } else {
        return Promise.resolve({
            gateway_id: payload.gateway_id,
            public_id: payload.public_id
        });
    }
}