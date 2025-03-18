import {
    apiTypeKeys,
    getBillingAddress,
    getShippingAddress,
    IAddress,
    IBatchableRequest
} from '@boldcommerce/checkout-frontend-library';
import {isObjectEmpty, isObjectEquals} from 'src/utils';

export const buildAddressBatchRequest = (
    address: IAddress,
    type: 'shipping'|'billing'
): IBatchableRequest | null => {
    const {setBillingAddress, updateBillingAddress, setShippingAddress, updateShippingAddress} = apiTypeKeys;

    const prevAddress = type === 'shipping' ? getShippingAddress() : getBillingAddress();
    const isPrevEmpty = isObjectEmpty(prevAddress);
    const isEqual = isObjectEquals(prevAddress, address);

    if (isPrevEmpty && !isEqual) {
        return {
            apiType: type === 'shipping' ? setShippingAddress : setBillingAddress,
            payload: address
        };
    } else if (!isEqual) {
        return {
            apiType: type === 'shipping' ? updateShippingAddress : updateBillingAddress,
            payload: address
        };
    }
    return null;
};
