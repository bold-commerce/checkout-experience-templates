import {useEffect, useState} from 'react';
import {Constants} from 'src/constants';
import {useGetValidVariable} from 'src/hooks';
import {useGetCloseBuyNow} from 'src/themes/buy-now/hooks';
import {IUseShippingPage} from 'src/themes/buy-now/types';
import {getTerm} from 'src/utils';

export function useShippingPage(): IUseShippingPage {
    const {closeBuyNow} = useGetCloseBuyNow();
    const [stopBack, setStopBack ] = useState(false);
    const flashText = getTerm('buy_now_shipping_address_incomplete', Constants.CUSTOM);
    const isValidAddress = useGetValidVariable('shippingAddress');

    useEffect(() => {
        if (isValidAddress) {
            setStopBack(false);
        } 
    }, [isValidAddress]);

    return {closeBuyNow, flashText, stopBack, setStopBack, isValidAddress};
}
