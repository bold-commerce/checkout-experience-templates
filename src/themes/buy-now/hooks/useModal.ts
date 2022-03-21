import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionGetInitialData, actionUpdateAppData } from 'src/action';
import { initializeSession, setDefaultAddresses } from 'src/library';
import { IInitializeEndpointData, IOrderInitialization } from 'src/types';
import { getOrderInitialization } from 'src/utils/getOrderInitialization';
import { IUseModal } from '../types';

export function useModal(): IUseModal {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenEvent = useCallback((e) => {
        const data: IInitializeEndpointData = e.detail;
        setIsOpen(true);
        document.body.style.position = 'fixed'; // prevent background scrolling
        const orderData: IOrderInitialization = getOrderInitialization(data);
        dispatch(actionUpdateAppData(orderData));
        dispatch(initializeSession);
        dispatch(actionGetInitialData(window.location.hostname));
        dispatch(setDefaultAddresses);
        
    }, [setIsOpen, dispatch]);

    const handleCloseEvent = useCallback(() => {
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
