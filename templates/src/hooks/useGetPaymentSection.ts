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
        dispatch(actionSetAppStateValid('pigiLoaded', false));
    }, []);
    const notValidDisplayText = getTerm('no_payment_methods_invalid_address_updated', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const loading = useGetLoaderScreenVariable('pigiIframe');
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');
    const [notValidText , setNotValidText] = useState(notValidDisplayText);
    const [isValidPigiLoad, setIsValidPigiLoad ]= useState(true);
    const isPigiLoaded = useGetValidVariable('pigiLoaded');
    const pigiErrorMsg =  getTerm('payment_gateway_loading_error', Constants.PAYMENT_INFO);
    const pigiSetStateFunction = () => {
        setNotValidText(pigiErrorMsg);
        setIsValidPigiLoad(false);
    };
    const onLoad = () => {
        if(isPigiLoaded) {
            setTimeout(async () => {
                await dispatch(checkLoadPigiErrors(pigiSetStateFunction));
            }, 1000);
        }
    };

    useEffect(() => {
        setNotValidText(notValidDisplayText);
    }, [notValidDisplayText]);

    return {loading, isValidAddress, isValidShippingLine, notValidText, fieldSectionText, onLoad, isValidPigiLoad};
}
