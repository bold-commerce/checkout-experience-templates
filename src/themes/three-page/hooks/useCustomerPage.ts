import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {
    useGetAppSettingData,
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useGetLifeFieldsOnPage,
    useGetRequiresShipping
} from 'src/hooks';
import {
    validateLifeFields,
    callCustomerPageApi
} from 'src/library';
import {useHistory} from 'react-router';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {IUseCustomerPageProp} from 'src/types';
import {getCheckoutUrl, getReturnToCartTermAndLink, getTerm} from 'src/utils';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';

export function useCustomerPage(): IUseCustomerPageProp {
    const dispatch = useDispatch();
    const history = useHistory();
    const nextButtonLoading = useGetIsLoading();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }
    const nextButtonDisable = useGetButtonDisableVariable('customerPageButton');
    const {term, link} = getReturnToCartTermAndLink();
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);

    const language = useGetAppSettingData('languageIso') as string;
    const title = getTerm('customer_info_title', Constants.GLOBAL_INFO, undefined , 'Checkout form, customer information');
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    } , [window.returnUrl]);
    const requiresShipping = useGetRequiresShipping();
    const nextButtonText = requiresShipping ? getTerm('cont_to_shipping', Constants.SHIPPING_INFO) : getTerm('footer_shipping_continue', Constants.SHIPPING_METHOD_INFO);
    const active = 1;
    const requiredLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.CUSTOMER_THREE_PAGE);
    const nextButtonOnClick = useCallback(() => {
        sendEvents('Clicked continue to shipping lines button', {'category': 'Checkout'});
        dispatch(actionClearErrors());
        dispatch(validateLifeFields(requiredLifeFields));
        dispatch(callCustomerPageApi(history));
    } , []);
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading, language, title};
}
