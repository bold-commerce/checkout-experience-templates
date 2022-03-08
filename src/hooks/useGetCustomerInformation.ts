import {useAppSelector} from 'src/hooks';
import {IApplicationStateCustomer} from 'src/types';

export function useGetCustomerInfoData(): IApplicationStateCustomer {
    return useAppSelector((state) => state.data.application_state.customer);
}

export function useGetCustomerInfoDataByField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.customer[fieldId]);
}

export function useGetCustomerMarketingField(): boolean {
    return useAppSelector((state) => state.data.application_state.customer.accepts_marketing);
}
