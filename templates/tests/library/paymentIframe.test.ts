import {baseReturnObject, getPaymentIframeUrl} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionSetPigiIframeLoader} from 'src/action';
import * as AppActions from 'src/action/appActionType';
import {getPaymentIframe, postCssStylingPigi} from 'src/library';
import {stateMock} from 'src/mocks/stateMock';
import {displayFatalErrorFromTranslation, handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/paymentIframe');
jest.mock('src/action/appAction');
jest.mock('src/utils');
const actionSetPigiIframeLoaderFuncMock = mocked(actionSetPigiIframeLoader, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const getPaymentIframeUrlMock = mocked(getPaymentIframeUrl, true);
const urlPigi = 'https://urlpigi.boldcommerce.com';

describe('testing getPaymentIframe function', () => {
    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const actionSetPigiIframeLoaderMock = {
        type: AppActions.SET_PIGI_IFRAME_LOADER,
        payload: {pigiIframeLoader: true}
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        actionSetPigiIframeLoaderFuncMock.mockReturnValue(actionSetPigiIframeLoaderMock);
    });

    test('Success is FALSE', async () => {
        getPaymentIframeUrlMock.mockReturnValueOnce(Promise.resolve(returnObject));

        const paymentIframeValue = await getPaymentIframe();
        await paymentIframeValue(dispatch, getState).then((returnedUrlForPigi) => {

            expect(actionSetPigiIframeLoaderFuncMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiIframeLoaderFuncMock).toHaveBeenCalledWith(true);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionSetPigiIframeLoaderMock);
            expect(dispatch).toHaveBeenCalledWith(postCssStylingPigi);
            expect(getPaymentIframeUrlMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledWith(stateMock, dispatch);
            expect(returnedUrlForPigi).not.toBeDefined();
            expect(returnedUrlForPigi).not.toBe(urlPigi);
        });
    });

    test('Success is TRUE', async () => {
        const returnObject = {...baseReturnObject, success: true, response: {data: {url: urlPigi}}};
        getPaymentIframeUrlMock.mockReturnValueOnce(Promise.resolve(returnObject));

        const paymentIframeValue = await getPaymentIframe();
        await paymentIframeValue(dispatch, getState).then((returnedUrlForPigi) => {

            expect(actionSetPigiIframeLoaderFuncMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiIframeLoaderFuncMock).toHaveBeenCalledWith(true);
            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenCalledWith(actionSetPigiIframeLoaderMock);
            expect(dispatch).toHaveBeenCalledWith(postCssStylingPigi);
            expect(getPaymentIframeUrlMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).not.toHaveBeenCalled();
            expect(displayFatalErrorFromTranslationMock).not.toHaveBeenCalledWith(stateMock, dispatch);
            expect(returnedUrlForPigi).toBeDefined();
            expect(returnedUrlForPigi).toBe(urlPigi);
        });
    });
});
