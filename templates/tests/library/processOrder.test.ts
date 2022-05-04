import {
    processOrder as processOrderLib,
    sendHandleScaActionAsync
} from '@bold-commerce/checkout-frontend-library';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {mocked} from 'jest-mock';
import {HistoryLocationState} from 'react-router';
import {actionSetAppStateValid, actionShowHideOverlayContent, SET_VALID, SHOW_HIDE_OVERLAY} from 'src/action';
import {checkErrorAndProceedToNextPage, getApplicationStateFromLib, processOrder} from 'src/library';
import {stateMock} from 'src/mocks';
import {getCheckoutUrl, handleErrorIfNeeded} from 'src/utils';
import {errorFields, errorSeverities, errorShowType, errorSubTypes, errorTypes} from 'src/constants';
import {useRemoveAllFlashErrors} from 'src/hooks';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/action');
jest.mock('src/hooks');
jest.mock('src/library/checkErrorAndProceedToNextPage');
jest.mock('src/utils/handleErrorIfNeeded');
const processOrderLibMock = mocked(processOrderLib, true);
const actionShowHideOverlayContentMock = mocked(actionShowHideOverlayContent, true);
const checkErrorAndProceedToNextPageMock = mocked(checkErrorAndProceedToNextPage, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded , true);
const useRemoveAllFlashErrorsMock = mocked(useRemoveAllFlashErrors , true);
const sendHandleScaActionAsyncMock = mocked(sendHandleScaActionAsync , true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid , true);

describe('testing checkErrorAndProceedToNextPage', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const checkErrorAndProceedToNextPageThunkMock = jest.fn();
    const returnObject = {...baseReturnObject};
    const historyMock = {replace: jest.fn()} as HistoryLocationState;
    const showHideAction = {type: SHOW_HIDE_OVERLAY, payload: {shown: false}};
    const setValidAction = {type: SET_VALID, payload: {'test': false}};

    beforeEach(() => {
        jest.resetAllMocks();
        window.shopAlias = 'test';
        window.platformType = 'shopify';
        dispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
        processOrderLibMock.mockReturnValue(Promise.resolve(returnObject));
        checkErrorAndProceedToNextPageMock.mockReturnValue(checkErrorAndProceedToNextPageThunkMock);
        actionShowHideOverlayContentMock.mockReturnValue(showHideAction);
        actionSetAppStateValidMock.mockReturnValue(setValidAction);
    });

    test('call without errors on state and success true', async () => {
        const successReturnObj = {...baseReturnObject, success: true, response: {}};
        processOrderLibMock.mockReturnValueOnce(successReturnObj);
        const noErrorsState = {...stateMock, errors: []};
        getState
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(noErrorsState);

        const processOrderThunk = processOrder(historyMock);
        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(processOrderLibMock).toHaveBeenCalledTimes(1);
            expect(useRemoveAllFlashErrorsMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(successReturnObj, dispatch, getState);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('/thank_you', 'paymentPageButton', historyMock, true, undefined);
            expect(dispatch).toHaveBeenCalledTimes(5);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(dispatch).toHaveBeenCalledWith(getApplicationStateFromLib);
            expect(dispatch).toHaveBeenCalledWith(showHideAction);

        });
    });

    test('call without errors on state and success true with handleSCA', async () => {
        const successReturnObj = {...baseReturnObject, success: true, response: {handleSCA: true}};
        processOrderLibMock.mockReturnValueOnce(successReturnObj);
        const noErrorsState = {...stateMock, errors: []};
        getState
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(noErrorsState);

        const processOrderThunk = processOrder(historyMock);
        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(processOrderLibMock).toHaveBeenCalledTimes(1);
            expect(useRemoveAllFlashErrorsMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(successReturnObj, dispatch, getState);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(0);
            expect(sendHandleScaActionAsyncMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(setValidAction);
            expect(dispatch).toHaveBeenCalledWith(setValidAction);

        });
    });

    test('call without errors on state and success true - Neuro ID page name provided', async () => {
        const successReturnObj = {...baseReturnObject, success: true, response: {}};
        processOrderLibMock.mockReturnValueOnce(successReturnObj);
        const noErrorsState = {...stateMock, errors: []};
        const pageNameNeuroID = 'page_name_neuro_id';
        getState
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(noErrorsState);

        const processOrderThunk = processOrder(historyMock, pageNameNeuroID);
        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(processOrderLibMock).toHaveBeenCalledTimes(1);
            expect(useRemoveAllFlashErrorsMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(successReturnObj, dispatch, getState);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledWith('/thank_you', 'paymentPageButton', historyMock, true, pageNameNeuroID);
            expect(dispatch).toHaveBeenCalledTimes(5);
            expect(dispatch).toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(dispatch).toHaveBeenCalledWith(getApplicationStateFromLib);
            expect(dispatch).toHaveBeenCalledWith(showHideAction);

        });
    });

    test('call without errors on state and success false', async () => {
        const successReturnObj = {...baseReturnObject, success: false, response: {}};
        processOrderLibMock.mockReturnValueOnce(successReturnObj);
        const noErrorsState = {...stateMock, errors: []};
        getState
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(noErrorsState);

        const processOrderThunk = processOrder(historyMock);
        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(3);
            expect(processOrderLibMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(successReturnObj, dispatch, getState);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).not.toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(getApplicationStateFromLib);
            expect(dispatch).toHaveBeenCalledWith(showHideAction);
        });
    });

    test('call with errors on state', async () => {
        const processOrderThunk = processOrder(historyMock);
        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(2);
            expect(processOrderLibMock).toHaveBeenCalledTimes(0);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).not.toHaveBeenCalledWith(checkErrorAndProceedToNextPageThunkMock);
            expect(dispatch).not.toHaveBeenCalledWith(getApplicationStateFromLib);
            expect(dispatch).toHaveBeenCalledWith(showHideAction);
        });
    });

    test('testing with inventory issue', async () => {

        const successReturnObj = {...baseReturnObject, success: false};
        processOrderLibMock.mockReturnValueOnce(successReturnObj);
        const noErrorsState = {...stateMock, errors: []};
        const errorsState = {...stateMock, errors: [{
            type: errorTypes.order,
            field: errorFields.inventory,
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.insufficient_stock,
            showType: errorShowType.none,
            section: '',
            term: ''
        }]};

        getState
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(noErrorsState)
            .mockReturnValueOnce(errorsState);
        const processOrderThunk = processOrder(historyMock);

        await processOrderThunk(dispatch, getState).then(() => {
            expect(getState).toHaveBeenCalledTimes(3);
            expect(processOrderLibMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(checkErrorAndProceedToNextPageMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(showHideAction);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/out_of_stock'));
        });
    });
});
