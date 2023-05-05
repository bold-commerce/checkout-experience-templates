import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IApiReturnObject,
    getPaymentIframeUrl,
    IApiSuccessResponse,
    IGetPaymentIframeUrl
} from '@boldcommerce/checkout-frontend-library';
import {displayFatalErrorFromTranslation, handleErrorIfNeeded} from 'src/utils';
import {actionSetAppStateValid, actionSetPigiIframeLoader} from 'src/action';
import {postCssStylingPigi} from 'src/library';

export function getPaymentIframe() {
    return async function getPaymentIframeThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<string | undefined> {
        dispatch(actionSetPigiIframeLoader(true));
        await dispatch(postCssStylingPigi);

        const response: IApiReturnObject = await getPaymentIframeUrl();
        handleErrorIfNeeded(response, dispatch, getState);

        if (!response.success) {
            displayFatalErrorFromTranslation(getState(), dispatch);
            return;
        } else {
            const {data} = response.response as IApiSuccessResponse;
            const {url} = data as IGetPaymentIframeUrl;
            dispatch(actionSetAppStateValid('pigiLoaded', true));
            return url;
        }
    };
}

