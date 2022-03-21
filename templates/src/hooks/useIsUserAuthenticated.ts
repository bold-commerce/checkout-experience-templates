import {useGetCustomerInfoDataByField} from 'src/hooks';

export function useIsUserAuthenticated(): boolean {
    const id = useGetCustomerInfoDataByField('platform_id');
    return (id != null && +id > 0);
}
