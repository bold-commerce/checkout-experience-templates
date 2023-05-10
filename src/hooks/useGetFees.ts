import {useAppSelector} from 'src/hooks/rootHooks';
import {IFees} from '@boldcommerce/checkout-frontend-library';

export function useGetFees(): Array<IFees> {
    return useAppSelector((state) => state.data.application_state.fees);
}
