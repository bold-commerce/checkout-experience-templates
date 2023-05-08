import {Dispatch} from 'redux';
import {
    cssStylingPaymentIframe,
    IApiReturnObject,
    ICssStylingPaymentIframeRequest, ICssStylingPaymentIframeResponse, IMediaRule, sendUpdateMediaMatchAction
} from '@boldcommerce/checkout-frontend-library';
import {getPigiIframe, getPigiStylingRules, handleErrorIfNeeded} from 'src/utils';
import {IOrderInitialization} from 'src/types';

export async function postCssStylingPigi(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const rules: ICssStylingPaymentIframeRequest = getPigiStylingRules();
    const promiseResponse = cssStylingPaymentIframe(rules);
    return promiseResponse.then(async (res: IApiReturnObject) => {
        handleErrorIfNeeded(res, dispatch, getState);
        if (res.success) {
            const pigiIframe = getPigiIframe();
            pigiIframe?.addEventListener('load', () => {
                const {data: {style_sheet: {mediaRules}}} = res.response as { data: ICssStylingPaymentIframeResponse };
                if (mediaRules && Array.isArray(mediaRules)) {
                    mediaRules.forEach((rule: IMediaRule) => {
                        const mediaMatch = window.matchMedia(rule.conditionText);
                        if (mediaMatch) {
                            mediaMatch.addEventListener('change', (event: MediaQueryListEvent) => sendUpdateMediaMatchAction(event.media, event.matches));
                            sendUpdateMediaMatchAction(mediaMatch.media, mediaMatch.matches);
                        }
                    });
                }
            });
        }
    });
}
