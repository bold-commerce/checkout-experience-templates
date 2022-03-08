import {useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {useGetButtonDisableVariable, useGetIsLoading} from 'src/hooks';
import {callCustomerPageApi} from 'src/library';
import {useHistory} from 'react-router';
import {Constants} from 'src/constants';
import {IUseCustomerPageProp} from 'src/types';
import {getTerm} from 'src/utils';

export function useCustomerPage(): IUseCustomerPageProp {
    const dispatch = useDispatch();
    const nextButtonLoading = useGetIsLoading();
    const nextButtonDisable = useGetButtonDisableVariable('customerPageButton');
    const history = useHistory();
    const backLinkText = `< ${getTerm('return_to_cart', Constants.CUSTOMER_INFO)}`;
    const backLinkOnClick = useCallback((event) => {
        event.preventDefault();
        window.location.href = window.returnUrl;
    } , [window.returnUrl]);
    const nextButtonText = getTerm('cont_to_shipping', Constants.SHIPPING_INFO);
    const active = 1;
    const nextButtonOnClick = useCallback(() => {
        dispatch(callCustomerPageApi(history));
    } , []);

    return {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading};
}
