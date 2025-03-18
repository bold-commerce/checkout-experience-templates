import {initEpsPaymentSdk} from 'src/eps';
import {stateMock} from 'src/mocks';
import {actionEpsBoldPayment} from 'src/action';
import {mocked} from 'jest-mock';

jest.mock('src/action/appAction');
const actionEpsBoldPaymentMock = mocked(actionEpsBoldPayment, true);

describe('testing initEpsPaymentSdk', () => {

    const dispatchMock = jest.fn();
    const historyMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        window.environment = {
            type: 'type',
            url: 'url',
            path: 'path'
        };

        window.bold = {
            Payments: jest.fn().mockImplementation()
        };
    });

    test('testing init payment sdk correctly', async () => {

        getStateMock.mockReturnValue(stateMock);

        const initEpsPaymentSdkThunk = initEpsPaymentSdk(historyMock);
        await initEpsPaymentSdkThunk(dispatchMock, getStateMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(actionEpsBoldPaymentMock).toHaveBeenCalledTimes(1);
        });
    });
});