import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionClearValidStates, actionGetInitialData, actionUpdateAppData } from 'src/action';
import { checkInventory, initializeSession, setDefaultAddresses } from 'src/library';
import { IOrderInitialization } from 'src/types';
import { getOrderInitialization } from 'src/utils/getOrderInitialization';
import { IUseModal } from '../types';
import { checkInventoryStage, IInitializeOrderResponse } from '@bold-commerce/checkout-frontend-library';

export function useModal(): IUseModal {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenEvent = useCallback(async (e) => {
        const data: IInitializeOrderResponse = e.detail;
        setIsOpen(true);
        document.body.style.position = 'fixed'; // prevent background scrolling
        const orderData: IOrderInitialization = getOrderInitialization(data);
        dispatch(actionUpdateAppData(orderData));
        dispatch(initializeSession);
        dispatch(actionGetInitialData(window.location.hostname));
        dispatch(setDefaultAddresses);
        dispatch(checkInventory(checkInventoryStage.initial));
    }, [setIsOpen, dispatch]);

    const handleCloseEvent = useCallback(() => {
        dispatch(actionClearValidStates());
        setIsOpen(false);
        document.body.style.position = 'initial'; // re-enable scrolling
    }, [setIsOpen, dispatch]);

    useEffect(() => {
        document.addEventListener('buyNow:open', handleOpenEvent);
        document.addEventListener('buyNow:close', handleCloseEvent);

        return () => {
            document.removeEventListener('buyNow:open', handleOpenEvent);
            document.removeEventListener('buyNow:close', handleCloseEvent);
        };
    }, []);

    return {isOpen};
}
