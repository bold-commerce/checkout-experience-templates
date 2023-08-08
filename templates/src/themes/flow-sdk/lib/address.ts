import {IMetaPaymentAddress} from 'src/themes/flow-sdk/types';

export const getFirstAddressLine = (address: IMetaPaymentAddress | undefined): string => {
    if (address?.addressLine &&
        Array.isArray(address?.addressLine) &&
        address.addressLine.length > 0
    ) {
        return address.addressLine[0].trim();
    }
    return '';
};

export const getSecondAddressLine = (address?: IMetaPaymentAddress | undefined): string => {
    if (address?.addressLine &&
        Array.isArray(address?.addressLine) &&
        address.addressLine.length > 1
    ) {
        return address.addressLine[1].trim();
    }
    return '';
};