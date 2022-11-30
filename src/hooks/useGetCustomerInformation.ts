import {useAppSelector} from 'src/hooks';
import {ICustomer} from '@bold-commerce/checkout-frontend-library';

export function useGetCustomerInfoData(): ICustomer {
    return useAppSelector((state) => state.data.application_state.customer);
}

export function useGetCustomerInfoDataByField(fieldId: string): string{
    return useAppSelector((state) => state.data.application_state.customer[fieldId]);
}

export function useGetCustomerMarketingField(): boolean {
    return useAppSelector((state) => state.data.application_state.customer.accepts_marketing);
}
