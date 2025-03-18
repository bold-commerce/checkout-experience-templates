import {useAppSelector} from 'src/hooks/rootHooks';
import {IFraudTool} from '@boldcommerce/checkout-frontend-library';

export function useGetFraudTools(): Array<IFraudTool> {
    return useAppSelector((state) => state.data.initial_data.fraud_tools);
}
