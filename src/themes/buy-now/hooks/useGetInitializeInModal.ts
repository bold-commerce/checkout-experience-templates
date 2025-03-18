import {useAppSelector} from 'src/hooks/rootHooks';
import {IUseGetInitializeInModal} from 'src/themes/buy-now/types';

export function useGetInitializeInModal(): IUseGetInitializeInModal {
    const isInitialized = useAppSelector((state) => state.isSessionInitialized);

    return (!isInitialized && window.initializedOrder?.data?.public_order_id)
        ? {
            initializeInModal: true,
            orderData: window.initializedOrder.data
        } : {
            initializeInModal: false,
            orderData: null,
        };
}
