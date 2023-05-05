import {useAppSelector} from 'src/hooks/rootHooks';
import {Constants} from 'src/constants';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

export function useGetShippingData(): IAddress{
    return useAppSelector((state) => state.data.application_state.addresses.shipping);
}

export function useGetShippingDataField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.addresses.shipping[fieldId]) ?? '';
}

export function useGetBillingData(): IAddress{
    return useAppSelector((state) => state.data.application_state.addresses.billing);
}

export function useGetBillingDataField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.addresses.billing[fieldId]) ?? '';
}

export function useGetAddressData(type: string): IAddress {
    return type === Constants.SHIPPING ? useGetShippingData() : useGetBillingData();
}

export function useGetAddressDataField(type: string, fieldId: string): string{
    if(type === Constants.SHIPPING) {
        return useGetShippingDataField(fieldId);
    } else {
        return useGetBillingDataField(fieldId);
    }
}

export function useGetSavedAddressOptions(): Array<IAddress>{
    return useAppSelector((state) => state.data.application_state.customer.saved_addresses);
}
