import {
    externalPaymentGatewayToParentActionTypes,
    IExternalPaymentGateway
} from '@bold-commerce/checkout-frontend-library';

import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
    handleExternalPaymentGatewayInitialized,
    removeExternalPaymentGatewayListenerInLibrary,
    setExternalPaymentGatewayListenerInLibrary,
} from 'src/library';
import {IExternalPaymentGatewayMessageFromIframe} from 'src/types';

export function useSetExternalPaymentGatewayListener(paymentGateway: IExternalPaymentGateway): void {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleExternalPaymentGatewayMessage = (e) => {
            const {type, payload} = e.data as IExternalPaymentGatewayMessageFromIframe;

            switch (type) {
                case externalPaymentGatewayToParentActionTypes.EXTERNAL_PAYMENT_GATEWAY_INITIALIZED:
                    dispatch(handleExternalPaymentGatewayInitialized(paymentGateway));
                    break;
                default:
                    break;
            }
        };

        dispatch(setExternalPaymentGatewayListenerInLibrary(paymentGateway, handleExternalPaymentGatewayMessage));
        return () => {
            dispatch(removeExternalPaymentGatewayListenerInLibrary());
        };
    }, []);
}
