import {Constants} from 'src/constants';
import {
    useGetExternalPaymentGatewayLoading, useGetExternalPaymentGatewayReady,
    useGetValidVariable,
    useSetExternalPaymentGatewayListener
} from 'src/hooks';
import {getTerm} from 'src/utils';
import {IUseGetExternalPaymentGatewaySection} from 'src/types';
import {useDispatch} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {actionSetExternalGatewayReady, actionSetExternalPaymentGatewayLoading} from 'src/action';
import {checkLoadExternalPaymentGatewayErrors} from 'src/library';
import {IExternalPaymentGateway} from '@boldcommerce/checkout-frontend-library';

export function useGetExternalPaymentGatewaySection(gateway: IExternalPaymentGateway): IUseGetExternalPaymentGatewaySection {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actionSetExternalGatewayReady(gateway, false));
        dispatch(actionSetExternalPaymentGatewayLoading(gateway, true));
    }, []);
    useSetExternalPaymentGatewayListener(gateway);
    const notValidDisplayText = getTerm('no_payment_methods_invalid_address_updated', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const loading = useGetExternalPaymentGatewayLoading(gateway);
    const isValidExternalLoad = useGetExternalPaymentGatewayReady(gateway);
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');
    const [notValidText, setNotValidText] = useState(notValidDisplayText);
    const paymentErrorMsg = getTerm('payment_gateway_loading_error', Constants.PAYMENT_INFO);
    const externalSetStateFunction = () => {
        setNotValidText(paymentErrorMsg);
        dispatch(actionSetExternalGatewayReady(gateway, false));
    };

    const onLoad = useCallback(() => {
        dispatch(actionSetExternalGatewayReady(gateway, true));
        setTimeout(async () => {
            await dispatch(checkLoadExternalPaymentGatewayErrors(gateway, externalSetStateFunction));
        }, 1000);
    }, []);

    useEffect(() => {
        setNotValidText(notValidDisplayText);
    }, [notValidDisplayText]);

    return {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidExternalLoad};
}
