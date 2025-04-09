import {Constants} from 'src/constants';
import {useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';
import {IUseGetPaymentSection} from 'src/types';
import {useEffect, useState} from 'react';

export function useGetPaymentSection(): IUseGetPaymentSection {
    const notValidDisplayText = getTerm('no_payment_methods_invalid_address_updated', Constants.PAYMENT_INFO);
    const fieldSectionText = getTerm('payment_method', Constants.PAYMENT_INFO);
    const isValidAddress = useGetValidVariable('shippingAddress');
    const isValidShippingLine = useGetValidVariable('shippingLine');
    const [notValidText , setNotValidText] = useState(notValidDisplayText);

    useEffect(() => {
        setNotValidText(notValidDisplayText);
    }, [notValidDisplayText]);

    return {isValidAddress, isValidShippingLine, notValidText, fieldSectionText};
}
