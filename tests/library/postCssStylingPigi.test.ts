import {baseReturnObject, cssStylingPaymentIframe, sendUpdateMediaMatchAction} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    stateMock,
    cssStylingPaymentIframeRequestMock,
    cssStylingPaymentIframeApiMock,
    mediaRuleApiMock1,
    mediaRuleApiMock2
} from 'src/mocks';
import {postCssStylingPigi} from 'src/library';
import {getPigiIframe, handleErrorIfNeeded, getPigiStylingRules} from 'src/utils';
import {createEvent, fireEvent} from '@testing-library/react';

jest.mock('@boldcommerce/checkout-frontend-library/lib/paymentIframe');
jest.mock('@boldcommerce/checkout-frontend-library/lib/pigi');
jest.mock('src/utils');
const cssStylingPaymentIframeMock = mocked(cssStylingPaymentIframe, true);
const getPigiIframeMock = mocked(getPigiIframe, true);
const getPigiStylingRulesMock = mocked(getPigiStylingRules, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const sendUpdateMediaMatchActionMock = mocked(sendUpdateMediaMatchAction, true);

describe('testing postCssStylingPigi', () => {
    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn();
    const getState = jest.fn();
    const matchMedia = jest.fn();
    const matchEventListenerMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        window.matchMedia = matchMedia;
    });

    test('Success is FALSE', async () => {
        getPigiStylingRulesMock.mockReturnValueOnce(cssStylingPaymentIframeRequestMock);
        cssStylingPaymentIframeMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await postCssStylingPigi(dispatch, getState).then(() => {

            expect(getPigiStylingRulesMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledWith(cssStylingPaymentIframeRequestMock);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(getPigiIframeMock).not.toHaveBeenCalled();
            expect(sendUpdateMediaMatchActionMock).not.toHaveBeenCalled();
        });
    });

    test('Success is TRUE but null iFrame', async () => {
        const returnObject = {...baseReturnObject, success: true, response: {data: cssStylingPaymentIframeApiMock}};
        getPigiStylingRulesMock.mockReturnValueOnce(cssStylingPaymentIframeRequestMock);
        cssStylingPaymentIframeMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getPigiIframeMock.mockReturnValueOnce(null);

        await postCssStylingPigi(dispatch, getState).then(() => {

            expect(getPigiStylingRulesMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledWith(cssStylingPaymentIframeRequestMock);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
            expect(sendUpdateMediaMatchActionMock).not.toHaveBeenCalled();
        });
    });

    test('Success is TRUE and iFrame triggers load event', async () => {
        const returnObject = {...baseReturnObject, success: true, response: {data: cssStylingPaymentIframeApiMock}};
        const iFrameMock = document.createElement('iframe');
        const mediaQueryListMock1 = {media: mediaRuleApiMock1.conditionText, matches: false, addEventListener: matchEventListenerMock};
        const mediaQueryListMock2 = {media: mediaRuleApiMock2.conditionText, matches: true, addEventListener: matchEventListenerMock};

        getPigiStylingRulesMock.mockReturnValueOnce(cssStylingPaymentIframeRequestMock);
        cssStylingPaymentIframeMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getPigiIframeMock.mockReturnValueOnce(iFrameMock);

        matchMedia
            .mockReturnValueOnce(mediaQueryListMock1)
            .mockReturnValueOnce(mediaQueryListMock2);

        matchEventListenerMock
            .mockImplementationOnce((type, handler) => handler({...mediaQueryListMock1, matches: true}))
            .mockImplementationOnce((type, handler) => handler({...mediaQueryListMock2, matches: false}));

        await postCssStylingPigi(dispatch, getState).then(() => {
            fireEvent(iFrameMock, createEvent('load', iFrameMock));

            expect(getPigiStylingRulesMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledWith(cssStylingPaymentIframeRequestMock);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledTimes(4);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledWith(mediaQueryListMock1.media, mediaQueryListMock1.matches);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledWith(mediaQueryListMock1.media, !mediaQueryListMock1.matches);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledWith(mediaQueryListMock2.media, mediaQueryListMock2.matches);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledWith(mediaQueryListMock2.media, !mediaQueryListMock2.matches);
        });
    });

    test('Success TRUE, load event and no mediaMatch', async () => {
        const returnObject = {...baseReturnObject, success: true, response: {data: cssStylingPaymentIframeApiMock}};
        const iFrameMock = document.createElement('iframe');

        getPigiStylingRulesMock.mockReturnValueOnce(cssStylingPaymentIframeRequestMock);
        cssStylingPaymentIframeMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getPigiIframeMock.mockReturnValueOnce(iFrameMock);

        matchMedia
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(null);

        await postCssStylingPigi(dispatch, getState).then(() => {
            fireEvent(iFrameMock, createEvent('load', iFrameMock));

            expect(getPigiStylingRulesMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledWith(cssStylingPaymentIframeRequestMock);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledTimes(0);
        });
    });

    test('Success TRUE, load event and no mediaRules', async () => {
        const data = {...cssStylingPaymentIframeApiMock};
        data.style_sheet.mediaRules = undefined;
        const returnObject = {...baseReturnObject, success: true, response: {data}};
        const iFrameMock = document.createElement('iframe');

        getPigiStylingRulesMock.mockReturnValueOnce(cssStylingPaymentIframeRequestMock);
        cssStylingPaymentIframeMock.mockReturnValueOnce(Promise.resolve(returnObject));
        getPigiIframeMock.mockReturnValueOnce(iFrameMock);

        await postCssStylingPigi(dispatch, getState).then(() => {
            fireEvent(iFrameMock, createEvent('load', iFrameMock));

            expect(getPigiStylingRulesMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledTimes(1);
            expect(cssStylingPaymentIframeMock).toHaveBeenCalledWith(cssStylingPaymentIframeRequestMock);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
            expect(sendUpdateMediaMatchActionMock).toHaveBeenCalledTimes(0);
        });
    });
});
