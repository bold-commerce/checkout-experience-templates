import {getExpressPayActions} from 'src/utils/getExpressPayActions';
import {mocked} from 'jest-mock';
import {initializePPCPExpressPay} from 'src/themes/paypal/utils';
import {Action, Location} from 'history';
import {HistoryLocationState} from 'react-router';
import {initPpcp} from '@boldcommerce/checkout-express-pay-library';

jest.mock('src/utils/getExpressPayActions');
jest.mock('@boldcommerce/checkout-express-pay-library');
const getExpressPayActionsMock = mocked(getExpressPayActions, true);
const initPpcpMock = mocked(initPpcp, true);

describe('Test initializePPCPExpressPay function', () => {

    const mockActionFunction = jest.fn().mockReturnValue(Promise.resolve());
    const historyMock: HistoryLocationState = {
        push: jest.fn(),
        action: {} as Action,
        location: {} as Location,
        createHref: jest.fn(),
        go: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
        forward: jest.fn(),
        listen: jest.fn(),
        block: jest.fn(),
    };
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.restoreAllMocks();
        getExpressPayActionsMock.mockReturnValue(mockActionFunction);
    });

    test('Test initializePPCPExpressPay', async () => {

        const initPPCP = initializePPCPExpressPay(historyMock);
        await initPPCP(dispatchMock, getStateMock).then(() => {
            expect(getExpressPayActionsMock).toHaveBeenCalledTimes(1);
            expect(getExpressPayActionsMock).toHaveBeenCalledWith(dispatchMock, getStateMock, historyMock);
            expect(initPpcpMock).toHaveBeenCalledTimes(1);
            expect(initPpcpMock).toHaveBeenCalledWith(mockActionFunction);

        });
    });
});
