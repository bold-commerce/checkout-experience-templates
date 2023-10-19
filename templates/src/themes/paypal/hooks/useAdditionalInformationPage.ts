import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading, useGetIsOrderProcessed, useGetLifeFieldsOnPage,} from 'src/hooks';
import {getCheckoutUrl, getTerm, getReturnToCartTermAndLink} from 'src/utils';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {useCallback} from 'react';
import {useHistory} from 'react-router';
import {IFormControlsProps} from 'src/types';
import {sendEvents} from 'src/analytics';
import {actionClearErrors} from 'src/action';
import {checkErrorAndProceedToNextPage, validateLifeFields} from 'src/library';

export function useAdditionalInformationPage(): IFormControlsProps{
    const history = useHistory();
    const dispatch = useDispatch();
    const isOrderCompleted = useGetIsOrderProcessed();
    if(isOrderCompleted){
        history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
    }

    const title = getTerm('payment_method_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');

    const {term, link} = getReturnToCartTermAndLink();
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    } , [link]);

    const nextButtonText = getTerm('footer_shipping_continue', Constants.SHIPPING_METHOD_INFO);
    const nextButtonLoading = useGetIsLoading();

    const nextButtonDisable = useGetButtonDisableVariable('paymentPageButton');
    const requiredLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.PAYPAL_ADDITIONAL_INFO_PAGE);

    const nextButtonOnClick = useCallback(() => {
        sendEvents('Clicked continue to payment button', {'category': 'Checkout'});
        dispatch(actionClearErrors());
        dispatch(validateLifeFields(requiredLifeFields));
        dispatch(checkErrorAndProceedToNextPage(Constants.PAYMENT_ROUTE, 'customerPageButton', history, false));
    } , []);
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));

    return {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title};
}
