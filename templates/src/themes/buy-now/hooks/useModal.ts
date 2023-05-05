import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {actionClearValidStates, actionGetInitialData, actionSetSessionInitialized, actionSetOverlayContent, actionShowHideOverlayContent, actionUpdateAppData} from 'src/action';
import {checkInventory, initializeSession, setDefaultAddresses, initializeExpressPay} from 'src/library';
import {IOrderInitialization, IOverlay} from 'src/types';
import {getOrderInitialization} from 'src/utils/getOrderInitialization';
import {IUseModal} from '../types';
import {checkInventoryStage, IInitializeOrderResponse} from '@boldcommerce/checkout-frontend-library';
import {useGetValidVariable} from 'src/hooks';
import {useHistory} from 'react-router';


export function useModal(): IUseModal {
    const dispatch = useDispatch();
    const history = useHistory();
    const isValidPigi = useGetValidVariable('pigi');
    const [isOpen, setIsOpen] = useState(false);
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
        dispatch(initializeExpressPay(history));
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

    useEffect(() => {
        if(isValidPigi){
            dispatch(actionShowHideOverlayContent(false));
        }
    }, [isValidPigi]);

    useEffect(() => {
        window.addEventListener('message', handlePostMessage);
        document.addEventListener('buyNow:close', handleCloseEvent);

        return () => {
            window.removeEventListener('message', handlePostMessage);
            document.removeEventListener('buyNow:close', handleCloseEvent);
        };
    }, []);

    return {isOpen};
}
