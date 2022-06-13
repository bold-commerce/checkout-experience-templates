import {useCallback, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed} from 'src/hooks';
import {callCustomerPageApi, checkInventory} from 'src/library';
import {useHistory} from 'react-router';
import {Constants, NeuroIdConstants} from 'src/constants';
import {IUseCustomerPageProp} from 'src/types';
import {getCheckoutUrl, getNeuroIdPageName, getTerm, neuroIdSubmit} from 'src/utils';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';
import {checkInventoryStage} from '@bold-commerce/checkout-frontend-library';

export function useCustomerPage(): IUseCustomerPageProp {
    const dispatch = useDispatch();
    const history = useHistory();
    const nextButtonLoading = useGetIsLoading();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl('/thank_you'));
    }
    const nextButtonDisable = useGetButtonDisableVariable('customerPageButton');
    const backLinkText = `< ${getTerm('return_to_cart', Constants.CUSTOMER_INFO)}`;
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        neuroIdSubmit(getNeuroIdPageName(NeuroIdConstants.customerPage));
        window.location.href = window.returnUrl;
    } , [window.returnUrl]);
    const nextButtonText = getTerm('cont_to_shipping', Constants.SHIPPING_INFO);
    const active = 1;
    const nextButtonOnClick = useCallback(() => {
        const pageNameNeuroId = getNeuroIdPageName(NeuroIdConstants.customerPage);
        sendEvents('Checkout', 'Clicked continue to shipping lines button');

        dispatch(actionClearErrors);
        dispatch(callCustomerPageApi(history, pageNameNeuroId));
    } , []);
    window.history.replaceState(null, '', getCheckoutUrl('/resume'));

    useEffect( () => {
        dispatch(checkInventory(checkInventoryStage.initial));
    }, []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading};
}
