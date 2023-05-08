import {
    externalPaymentGatewayToParentActionTypes,
    IExternalPaymentGateway
} from '@boldcommerce/checkout-frontend-library';

import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
    handleExternalPaymentGatewayAddPayment,
    handleExternalPaymentGatewayInitialized,
    handleExternalPaymentGatewayRefreshOrder,
    handleExternalPaymentGatewayUpdateHeight,
    removeExternalPaymentGatewayListenerInLibrary,
    setExternalPaymentGatewayListenerInLibrary,
} from 'src/library';
import {
    IExternalPaymentGatewayMessageFromIframe,
    IExternalPaymentGatewayAddPayment,
    IExternalPaymentGatewayUpdateHeight
} from 'src/types';

export function useSetExternalPaymentGatewayListener(paymentGateway: IExternalPaymentGateway): void {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleExternalPaymentGatewayMessage = (e) => {
            const {type, payload} = e.data as IExternalPaymentGatewayMessageFromIframe;

            switch (type) {
                case externalPaymentGatewayToParentActionTypes.EXTERNAL_PAYMENT_GATEWAY_INITIALIZED:
                    dispatch(handleExternalPaymentGatewayInitialized(paymentGateway));
                    break;
                case externalPaymentGatewayToParentActionTypes.EXTERNAL_PAYMENT_GATEWAY_ADD_PAYMENT:
                    dispatch(handleExternalPaymentGatewayAddPayment(paymentGateway, payload as IExternalPaymentGatewayAddPayment));
                    break;
                case externalPaymentGatewayToParentActionTypes.EXTERNAL_PAYMENT_GATEWAY_UPDATE_HEIGHT:
                    dispatch(handleExternalPaymentGatewayUpdateHeight(paymentGateway, payload as IExternalPaymentGatewayUpdateHeight));
                    break;
                case externalPaymentGatewayToParentActionTypes.EXTERNAL_PAYMENT_GATEWAY_REFRESH_ORDER:
                    dispatch(handleExternalPaymentGatewayRefreshOrder());
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
