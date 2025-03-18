import {
    baseReturnObject,
    getShippingAddress,
    IApiReturnObject,
    IFetchError,
    ISetShippingAddressRequest,
    setShippingAddress,
    updateShippingAddress,
} from '@boldcommerce/checkout-frontend-library';
import {isAddressValid, isObjectEmpty, isObjectEquals} from 'src/utils';
import {API_RETRY} from 'src/constants';

export async function callShippingAddressEndpoint(shippingAddress: ISetShippingAddressRequest, validate = true): Promise<IApiReturnObject> {
    const prevShippingAddress = getShippingAddress();
    const isPrevEmpty = isObjectEmpty(prevShippingAddress);
    const isEmpty = isObjectEmpty(shippingAddress);
    const isEqual = isObjectEquals(prevShippingAddress, shippingAddress);
    let success = true;

    if (validate && !isEmpty && !isEqual) {
        success = await isAddressValid(
            shippingAddress.first_name || '',
            shippingAddress.last_name || '',
            shippingAddress.address_line_1 || '',
            shippingAddress.address_line_2 || '',
            shippingAddress.city || '',
            shippingAddress.postal_code || '',
            shippingAddress.country_code || '',
            shippingAddress.province_code || '',
            shippingAddress.phone_number || '',
            'shipping');
    }

    if (success) {
        if (isPrevEmpty && !isEqual) {
            return await setShippingAddress(shippingAddress, API_RETRY);
        } else {
            if (!isEqual) {
                return await updateShippingAddress(shippingAddress, API_RETRY);
            } else {
                success = true;
            }
        }
    }
    const error = !success ? new Error('Invalid Shipping Address') as IFetchError : null;
    return {...baseReturnObject, success, error};
}
