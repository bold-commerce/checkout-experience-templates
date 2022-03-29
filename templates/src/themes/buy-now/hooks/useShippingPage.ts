import { useEffect, useState } from 'react';
import { useGetValidVariable } from 'src/hooks';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { IUseShippingPage } from 'src/themes/buy-now/types';

export function useShippingPage(): IUseShippingPage {
    const closeBuyNow = useGetCloseBuyNow();
    const [stopBack, setStopBack ] = useState(false);
    const flashText = 'Finish filling out fields or select a previously saved address'; // TODO getTerm value here.
    const isValidAddress = useGetValidVariable('shippingAddress');

    useEffect(() => {
        if (isValidAddress) {
            setStopBack(false);
        } 
    }, [isValidAddress]);

    return { closeBuyNow, flashText, stopBack, setStopBack, isValidAddress };
}
