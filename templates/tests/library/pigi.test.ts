import {setPigiListener, sendUpdateLanguageAction} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    actionSetPigiDisplaySca,
    actionSetPigiIframeLoader,
    actionShowHideOverlayContent
} from 'src/action';
import {pigiPaymentTypes} from 'src/constants';
import {
    displayOrderProcessingScreen,
    getUpdatedApplicationState,
    handlePigiAddPayment,
    handlePigiHeight,
    handlePigiInitialized,
    handlePigiPaymentAdded,
    handlePigiRefreshOrder,
    handlePigiSca,
    processOrder,
    setPigiListenerInLibrary,
    updatePigiLanguage
} from 'src/library';
import {stateMock} from 'src/mocks';
import {IPigiResponsesPayload} from 'src/types';
import {updatePigiHeight} from 'src/utils';
import {useSendEvent} from 'src/hooks';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/action');
jest.mock('src/library/processOrder');
jest.mock('src/utils');
jest.mock('src/hooks/useSendEvent');
const setPigiListenerMock = mocked(setPigiListener, true);
const sendUpdateLanguageActionMock = mocked(sendUpdateLanguageAction, true);
const actionSetPigiDisplayScaMock = mocked(actionSetPigiDisplaySca, true);
const actionSetPigiIframeLoaderMock = mocked(actionSetPigiIframeLoader, true);
const actionShowHideOverlayContentMock = mocked(actionShowHideOverlayContent, true);
const processOrderMock = mocked(processOrder, true);
const updatePigiHeightMock = mocked(updatePigiHeight, true);
const useSendEventMock = mocked(useSendEvent, true);

describe('testing getPaymentIframe function', () => {const callbackEvent = (): void => { return; };
    const frameId = 'frame-id';
    const actionMock = {type: 'TEST_ACTION', payload: {testKey: 'test'}};
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const historyMock = {replace: jest.fn()} as unknown as History;

    beforeEach(() => {
        jest.resetAllMocks();
        window.scrollTo = jest.fn();
        dispatchMock.mockReturnValue(Promise.resolve());
        getStateMock.mockReturnValue(stateMock);
        actionSetPigiIframeLoaderMock.mockReturnValue(actionMock);
        actionShowHideOverlayContentMock.mockReturnValue(actionMock);
        actionSetPigiDisplayScaMock.mockReturnValue(actionMock);
    });

    test('setPigiListener called', async () => {
        const setPigiListenerThunk = await setPigiListenerInLibrary(frameId, callbackEvent);
        await setPigiListenerThunk().then(() => {
            expect(setPigiListenerMock).toHaveBeenCalledTimes(1);
        });
    });

    test('handlePigiInitialized called', async () => {
        const handlePigiInitializedThunk = await handlePigiInitialized();
        await handlePigiInitializedThunk(dispatchMock).then(() => {
            expect(actionSetPigiIframeLoaderMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiIframeLoaderMock).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(actionMock);
            expect(useSendEventMock).toHaveBeenCalled();
        });
    });

    test('handlePigiAddPayment called with success true', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true};
        const processOrderThunkMock = jest.fn();
        processOrderMock.mockReturnValueOnce(processOrderThunkMock);

        const handlePigiAddPaymentThunk = await handlePigiAddPayment(payloadMock, historyMock);
        await handlePigiAddPaymentThunk(dispatchMock).then(() => {
            expect(processOrderMock).toHaveBeenCalledTimes(1);
            expect(processOrderMock).toHaveBeenCalledWith(historyMock);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
            expect(dispatchMock).toHaveBeenCalledWith(processOrderThunkMock);
        });
    });

    test('handlePigiAddPayment called with GIFT_CARD success true', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: false, paymentType: pigiPaymentTypes.GIFT_CARD};

        const handlePigiAddPaymentThunk = await handlePigiAddPayment(payloadMock, historyMock);
        await handlePigiAddPaymentThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
            expect(dispatchMock).toHaveBeenCalledWith(actionMock);
        });
    });

    test('handlePigiAddPayment called with PAYPAL success true', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true, paymentType: pigiPaymentTypes.PAYPAL};
        const handlePigiAddPaymentThunk = await handlePigiAddPayment(payloadMock, historyMock);
        await handlePigiAddPaymentThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
            expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
            expect(processOrderMock).toHaveBeenCalledTimes(1);
        });
    });

    test('handlePigiAddPayment called with success false', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: false};

        const handlePigiAddPaymentThunk = await handlePigiAddPayment(payloadMock, historyMock);
        await handlePigiAddPaymentThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
            expect(dispatchMock).toHaveBeenCalledWith(actionMock);
        });
    });

    test('handlePigiPaymentAdded called', async () => {
        const handlePigiPaymentAddedThunk = await handlePigiPaymentAdded();
        await handlePigiPaymentAddedThunk(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
        });
    });

    test('handlePigiSca called with step DISPLAYED', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true, step: 'DISPLAYED'};
        const overlayActionMock = {...actionMock, type: 'OVERLAY_ACTION_TEST'};
        const displayScaActionMock = {...actionMock, type: 'DISPLAY_SCA_ACTION_TEST'};
        actionShowHideOverlayContentMock.mockReturnValueOnce(overlayActionMock);
        actionSetPigiDisplayScaMock.mockReturnValueOnce(displayScaActionMock);

        const handlePigiScaThunk = await handlePigiSca(payloadMock);
        await handlePigiScaThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledWith(false);
            expect(window.scrollTo).toHaveBeenCalledTimes(1);
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
            expect(updatePigiHeightMock).toHaveBeenCalledTimes(1);
            expect(updatePigiHeightMock).toHaveBeenCalledWith('100%');
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledWith(true);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(overlayActionMock);
            expect(dispatchMock).toHaveBeenCalledWith(displayScaActionMock);
        });
    });

    test('handlePigiSca called with step COMPLETED', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true, step: 'COMPLETED'};
        const overlayActionMock = {...actionMock, type: 'OVERLAY_ACTION_TEST'};
        const displayScaActionMock = {...actionMock, type: 'DISPLAY_SCA_ACTION_TEST'};
        actionShowHideOverlayContentMock.mockReturnValueOnce(overlayActionMock);
        actionSetPigiDisplayScaMock.mockReturnValueOnce(displayScaActionMock);

        const handlePigiScaThunk = await handlePigiSca(payloadMock);
        await handlePigiScaThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledWith(true);
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(overlayActionMock);
            expect(dispatchMock).toHaveBeenCalledWith(displayScaActionMock);
        });
    });

    test('handlePigiSca called with step FAILED', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true, step: 'FAILED'};
        const overlayActionMock = {...actionMock, type: 'OVERLAY_ACTION_TEST'};
        const displayScaActionMock = {...actionMock, type: 'DISPLAY_SCA_ACTION_TEST'};
        actionShowHideOverlayContentMock.mockReturnValueOnce(overlayActionMock);
        actionSetPigiDisplayScaMock.mockReturnValueOnce(displayScaActionMock);

        const handlePigiScaThunk = await handlePigiSca(payloadMock);
        await handlePigiScaThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledWith(false);
            expect(updatePigiHeightMock).toHaveBeenCalledTimes(1);
            expect(updatePigiHeightMock).toHaveBeenCalledWith('100px');
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledTimes(1);
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledWith(false);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(overlayActionMock);
            expect(dispatchMock).toHaveBeenCalledWith(displayScaActionMock);
        });
    });

    test('handlePigiSca called with step undefined', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 100, success: true};

        const handlePigiScaThunk = await handlePigiSca(payloadMock);
        await handlePigiScaThunk(dispatchMock).then(() => {
            expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(0);
            expect(actionSetPigiDisplayScaMock).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });

    test('handlePigiRefreshOrder called', async () => {
        const handlePigiRefreshOrderThunk = await handlePigiRefreshOrder();
        await handlePigiRefreshOrderThunk(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(getUpdatedApplicationState);
        });
    });

    test('handlePigiHeight called with pigiDisplaySca false', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 123, success: true, step: 'DISPLAYED'};

        const handlePigiHeightThunk = await handlePigiHeight(payloadMock);
        await handlePigiHeightThunk(dispatchMock, getStateMock).then(() => {
            expect(updatePigiHeightMock).toHaveBeenCalledTimes(1);
            expect(updatePigiHeightMock).toHaveBeenCalledWith('123px');
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });

    test('handlePigiHeight called with pigiDisplaySca true', async () => {
        const payloadMock: IPigiResponsesPayload = {height: 123, success: true, step: 'DISPLAYED'};
        const newStateMock = {...stateMock};
        newStateMock.appSetting.pigiDisplaySca = true;
        getStateMock.mockReturnValue(newStateMock);

        const handlePigiHeightThunk = await handlePigiHeight(payloadMock);
        await handlePigiHeightThunk(dispatchMock, getStateMock).then(() => {
            expect(updatePigiHeightMock).toHaveBeenCalledTimes(1);
            expect(updatePigiHeightMock).toHaveBeenCalledWith('100%');
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });

    test('testing updatePigiLanguage', async () => {
        const newStateMock = {...stateMock};
        newStateMock.appSetting.languageIso = 'es';
        getStateMock.mockReturnValue(newStateMock);

        const updatePigiLanguageThunk = await updatePigiLanguage();
        await updatePigiLanguageThunk(dispatchMock, getStateMock).then(() => {
            expect(sendUpdateLanguageActionMock).toHaveBeenCalledTimes(1);
            expect(sendUpdateLanguageActionMock).toHaveBeenCalledWith('es');
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });
});
