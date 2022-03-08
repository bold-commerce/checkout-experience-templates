import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getPaymentIframeUrl} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'ts-jest/utils';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {stateMock} from 'src/mocks/stateMock';
import {getPaymentIframe, postCssStylingPigi} from 'src/library';
import {displayFatalErrorFromTranslation, handleErrorIfNeeded} from 'src/utils';
import * as AppActions from 'src/action/appActionType';
import * as appAction from 'src/action/appAction';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/utils');
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const getPaymentIframeUrlMock = mocked(getPaymentIframeUrl, true);
const urlPigi = 'https://urlpigi.boldcommerce.com';

describe('testing getPaymentIframe function', () => {
    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const calledOnce = 1;
    const calledTwice = 2;
    const actionSetPigiIframeLoaderMock = {
        type: AppActions.SET_PIGI_IFRAME_LOADER,
        payload: {pigiIframeLoader: true}
    };
    let actionSetPigiIframeLoaderSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        actionSetPigiIframeLoaderSpy = jest.spyOn(appAction, 'actionSetPigiIframeLoader');
        actionSetPigiIframeLoaderSpy.mockReturnValue(actionSetPigiIframeLoaderMock);
    });

    test('Success is FALSE', async () => {
        getPaymentIframeUrlMock.mockReturnValueOnce(Promise.resolve(returnObject));

        const paymentIframeValue = await getPaymentIframe();
        await paymentIframeValue(dispatch, getState).then((returnedUrlForPigi) => {

            expect(actionSetPigiIframeLoaderSpy).toHaveBeenCalledTimes(calledOnce);
            expect(actionSetPigiIframeLoaderSpy).toHaveBeenCalledWith(true);
            expect(dispatch).toHaveBeenCalledTimes(calledTwice);
            expect(dispatch).toHaveBeenCalledWith(actionSetPigiIframeLoaderMock);
            expect(dispatch).toHaveBeenCalledWith(postCssStylingPigi);
            expect(getPaymentIframeUrlMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(calledOnce);
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

            expect(actionSetPigiIframeLoaderSpy).toHaveBeenCalledTimes(calledOnce);
            expect(actionSetPigiIframeLoaderSpy).toHaveBeenCalledWith(true);
            expect(dispatch).toHaveBeenCalledTimes(calledTwice);
            expect(dispatch).toHaveBeenCalledWith(actionSetPigiIframeLoaderMock);
            expect(dispatch).toHaveBeenCalledWith(postCssStylingPigi);
            expect(getPaymentIframeUrlMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).not.toHaveBeenCalled();
            expect(displayFatalErrorFromTranslationMock).not.toHaveBeenCalledWith(stateMock, dispatch);
            expect(returnedUrlForPigi).toBeDefined();
            expect(returnedUrlForPigi).toBe(urlPigi);
        });
    });
});
