import {actionClearErrors} from 'src/action';
import {sendEvents} from 'src/analytics';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {
    useGetAppSettingData,
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLifeFieldsOnPage
} from 'src/hooks';
import {callShippingLinesPageApi, validateLifeFields} from 'src/library';
import {IUseCustomerPageProp} from 'src/types';
import {getCheckoutUrl, getTerm, isShippingLineSelectedValid} from 'src/utils';

import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';

export function useShippingPage(): IUseCustomerPageProp{
    const dispatch = useDispatch();
    const history = useHistory();
    const isOrderCompleted = useGetIsOrderProcessed();
    const isSelectedShippingLine = isShippingLineSelectedValid();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }

    const nextButtonDisable = useGetButtonDisableVariable('shippingPageButton') && !isSelectedShippingLine;
    const nextButtonLoading = useGetIsLoading();
    const backLinkText = getTerm('footer_shipping_cust_info', Constants.SHIPPING_METHOD_INFO);
    const language = useGetAppSettingData('languageIso') as string;
    const title = getTerm('shipping_lines_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, shipping method');
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        history.replace(getCheckoutUrl(''));
    } , [history]);
    const nextButtonText = getTerm('footer_shipping_continue', Constants.SHIPPING_METHOD_INFO);
    const active = 2;

    const requiredLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.SHIPPING_THREE_PAGE);
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Clicked continue to payment button', {'category': 'Checkout'});
        dispatch(actionClearErrors());
        dispatch(callShippingLinesPageApi(history));
        dispatch(validateLifeFields(requiredLifeFields));
    } , []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading, language, title};
}
