import {Constants} from 'src/constants';
import {useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';
import {IUseGetPaymentSection} from 'src/types';
import {useDispatch} from 'react-redux';
import {useEffect, useState} from 'react';
import {checkLoadPigiErrors} from 'src/library';
import {actionSetAppStateValid} from 'src/action';

export function useGetPaymentSection(): IUseGetPaymentSection {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actionSetAppStateValid('pigi', false));
    }, []);
    const notValidDisplayText = getTerm('no_payment_methods_invalid_address', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const loading = useGetLoaderScreenVariable('pigiIframe');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');
    const [notValidText , setNotValidText] = useState(notValidDisplayText);
    const [isValidPigiLoad, setIsValidPigiLoad ]= useState(true);
    const pigiErrorMsg =  getTerm('payment_gateway_loading_error', Constants.PAYMENT_INFO);
    const pigiSetStateFunction = () => {
        setNotValidText(pigiErrorMsg);
        setIsValidPigiLoad(false);
    };
    const onLoad = () => {
        setTimeout(async () => {
            await dispatch(checkLoadPigiErrors(pigiSetStateFunction));
        }, 1000);
    };

    return {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidPigiLoad};
}
