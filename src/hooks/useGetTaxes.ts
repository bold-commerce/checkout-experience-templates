import {useAppSelector} from 'src/hooks/rootHooks';
import {ITax} from '@bold-commerce/checkout-frontend-library';

export function useGetTaxes(): Array<ITax> {
    return useAppSelector((state) => state.data.application_state.taxes);
}
