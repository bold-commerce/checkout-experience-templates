import {IFormControlsProps} from 'src/types';
import {
    getTerm,
    getTotalsFromState,
    getReturnToCartTermAndLink,
    callEpsProcessOrder
} from 'src/utils';
import {Constants, LifeInputPageConstants} from 'src/constants';
import {useGetAppSettingData, useGetIsLoading, useGetLifeFieldsOnPage} from 'src/hooks';
import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';

export type IUseGetOnePageFooterDataProps = IFormControlsProps & Required<Pick<IFormControlsProps, 'nextButtonOnClick'>>

export function useGetOnePageFooterData(): IUseGetOnePageFooterDataProps {
    const dispatch = useDispatch();
    const history = useHistory();
    const totals = getTotalsFromState();
    const {term, link} = getReturnToCartTermAndLink();
    const language = useGetAppSettingData('languageIso') as string;
    const backLinkText = getTerm(term, Constants.CUSTOMER_INFO);
    const nextButtonText = getTerm('complete_order', Constants.PAYMENT_INFO);
    const nextButtonLoading = useGetIsLoading();
    const title = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const nextButtonTestDataId = 'footer-complete-order-button';
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = link;
    }, [link]);
    const requiredLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE);
    const thankYouPageLifeFields = useGetLifeFieldsOnPage(LifeInputPageConstants.THANK_YOU_PAGE);
    const nextButtonOnClick = useCallback(() => {
        dispatch(callEpsProcessOrder(history, totals, requiredLifeFields, thankYouPageLifeFields));
    }, [totals]);

    return {backLinkOnClick, backLinkText, nextButtonOnClick, nextButtonText, nextButtonLoading, language, title, nextButtonTestDataId};
}
