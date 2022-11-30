import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {actionSetAppStateValid} from 'src/action';
import {Constants} from 'src/constants';
import {setShippingAddressAsValid} from 'src/library';
import {stateMock} from 'src/mocks';
import {IError, IOrderInitialization} from 'src/types';

jest.mock('src/action');
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);

describe('testing postShippingLines', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;
    const shippingError:IError = {
        address_type: Constants.SHIPPING,
        message: 'test error',
        type: 'test',
        field: 'test',
        severity: 'test',
        sub_type: 'testing shipping'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    test('calling post shipping address endpoint with  getState returning a different data structure', async () => {
        await setShippingAddressAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(2);
    });

    test('calling post shipping address endpoint with  getState returning a different data structure', async () => {
        getState().errors = [shippingError];
        await setShippingAddressAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
    });
});
