import {useAppSelector} from 'src/hooks/rootHooks';
import {IAddress} from 'src/types';
import {Constants} from 'src/constants';

export function useGetShippingData(): IAddress{
    return useAppSelector((state) => state.data.application_state.addresses.shipping);
}

export function useGetShippingDataField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.addresses.shipping[fieldId]);
}

export function useGetBillingData(): IAddress{
    return useAppSelector((state) => state.data.application_state.addresses.billing);
}

export function useGetBillingDataField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.addresses.billing[fieldId]);
}

export function useGetAddressDataField(type: string, fieldId: string): string{
    if(type === Constants.SHIPPING) {
        return useGetShippingDataField(fieldId);
    }
    else {
        return useGetBillingDataField(fieldId);
    }
}

export function useGetSavedAddressOptions(): Array<IAddress>{
    return useAppSelector((state) => state.data.application_state.customer.saved_addresses);
}