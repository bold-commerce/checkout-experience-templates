import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {actionClearValidStates, actionGetInitialData, actionSetSessionInitialized, actionSetOverlayContent, actionUpdateAppData, actionShowHideOverlayContent} from 'src/action';
import {checkInventory, initializeSession, setDefaultAddresses} from 'src/library';
import {IOrderInitialization, IOverlay} from 'src/types';
import {getOrderInitialization} from 'src/utils/getOrderInitialization';
import {IUseModal} from 'src/themes/buy-now/types';
import {checkInventoryStage, IInitializeOrderResponse} from '@boldcommerce/checkout-frontend-library';
import {useGetInitializeInModal} from 'src/themes/buy-now/hooks';


export function useModal(): IUseModal {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const {initializeInModal, orderData} = useGetInitializeInModal();
    const overlay: IOverlay = {
        shown: true,
        inverted: true,
        header: '',
        content: '',
        buttonText: '',
        showCustomContent: true
    };

    const handleOpenEvent = useCallback(() => {
        setIsOpen(true);
        dispatch(actionSetOverlayContent(overlay));
    }, [setIsOpen]);

    const handleInitializeEvent = useCallback(async (data: IInitializeOrderResponse) => {
        const orderData: IOrderInitialization = getOrderInitialization(data);
        dispatch(actionUpdateAppData({...orderData, overlay}));
        dispatch(initializeSession);
        dispatch(actionGetInitialData(window.location.hostname));
        dispatch(setDefaultAddresses);
        dispatch(checkInventory(checkInventoryStage.initial, false));
    }, [setIsOpen, dispatch]);

    const handleCloseEvent = useCallback(() => {
        dispatch(actionClearValidStates());
        dispatch(actionSetSessionInitialized(false));
        setIsOpen(false);
        window.parent.postMessage({type: 'buyNow:close'}, '*');
    }, [setIsOpen, dispatch]);

    const handlePostMessage = useCallback((e) => {
        if(e.data.type === 'buyNow:open'){
            handleOpenEvent();
        } else if(e.data.type === 'buyNow:initialized'){
            handleInitializeEvent(e.data.detail);
        }
    }, []);

    dispatch(actionShowHideOverlayContent(false));

    useEffect(() => {
        if (initializeInModal && orderData) {
            handleInitializeEvent(orderData);
            handleOpenEvent();
        }

        window.addEventListener('message', handlePostMessage);
        document.addEventListener('buyNow:close', handleCloseEvent);

        return () => {
            window.removeEventListener('message', handlePostMessage);
            document.removeEventListener('buyNow:close', handleCloseEvent);
        };
    }, []);

    return {isOpen};
}
