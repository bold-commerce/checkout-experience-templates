import {
    deleteAddress,
    displayOrderProcessingScreen,
    getApplicationStateFromLib,
    initializeExpressPay
} from 'src/library';
import {actionTypes, initialize} from '@bold-commerce/checkout-express-pay-library';
import {mocked} from 'jest-mock';
import {SET_EXPRESS_PAYMENT_SECTION_ENABLED} from 'src/action';
import * as AppActions from 'src/action/appActionType';
import {getCheckoutUrl, getHook} from 'src/utils';
import {HistoryLocationState} from 'react-router';
import {Constants} from 'src/constants';

jest.mock('@bold-commerce/checkout-express-pay-library');
jest.mock('src/library/applicationState');
jest.mock('src/library/displayOrderProcessingScreen');
const initializeExpressPayMock = mocked(initialize, true);
const getApplicationStateFromLibMock = mocked(getApplicationStateFromLib, true);
const displayOrderProcessingScreenMock = mocked(displayOrderProcessingScreen, true);

describe('testing initializeExpressPay', () => {
    const dispatchMock = jest.fn();
    const historyMock = {replace: jest.fn()} as HistoryLocationState;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('testing ENABLE_DISABLE_SECTION action', async () => {
        initializeExpressPayMock.mockImplementation(({onAction})=> {
            onAction(actionTypes.ENABLE_DISABLE_SECTION, {show:true});
        });
        const expectedAction = {type: SET_EXPRESS_PAYMENT_SECTION_ENABLED, payload: {isExpressPaySectionEnable:true}};

        const expressPay = await initializeExpressPay(historyMock);
        expressPay(dispatchMock).then(() => {
            expect(initializeExpressPayMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(getApplicationStateFromLibMock);
            expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
        });
    });

    test('testing ORDER_COMPLETED action', async () => {
        initializeExpressPayMock.mockImplementation(({onAction})=> {
            onAction(actionTypes.ORDER_COMPLETED);
        });
        const expectedAction = {type: AppActions.SET_VALID, payload: {field:'orderProcessed', value: true}};

        const expressPay = await initializeExpressPay(historyMock);
        expressPay(dispatchMock).then(() => {
            expect(initializeExpressPayMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(getApplicationStateFromLibMock);
            expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
        });
    });

    test('testing ORDER_PROCESSING action', async () => {
        initializeExpressPayMock.mockImplementation(({onAction})=> {
            onAction(actionTypes.ORDER_PROCESSING);
        });

        const expressPay = await initializeExpressPay(historyMock);
        expressPay(dispatchMock).then(() => {
            expect(initializeExpressPayMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
            expect(dispatchMock).toHaveBeenCalledWith(getApplicationStateFromLibMock);
        });
    });

    test('testing with default action', async () => {
        initializeExpressPayMock.mockImplementation(({onAction})=> {
            onAction('test');
        });

        const expressPay = await initializeExpressPay(historyMock);
        expressPay(dispatchMock).then(() => {
            expect(initializeExpressPayMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(getApplicationStateFromLibMock);
        });
    });

});
