import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';
import {Constants, errorSubTypes} from 'src/constants';
export function getAddressType (addressType: string, error: IApiErrorResponse): string {
    let result = addressType || error.address_type || '';
    if (result === '') {
        if (error.sub_type == errorSubTypes.shipping_address) {
            result = Constants.SHIPPING;
        } else if (error.sub_type == errorSubTypes.billing_address) {
            result = Constants.BILLING;
        }
    }
    return result;
}