import {IApplicationStateTax} from 'src/types';
import {useAppSelector} from 'src/hooks/rootHooks';

export function useGetTaxes(): Array<IApplicationStateTax> {
    return useAppSelector((state) => state.data.application_state.taxes);
}
