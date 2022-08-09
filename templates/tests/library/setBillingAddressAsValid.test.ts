import {mocked} from 'jest-mock';
import {Dispatch} from 'redux';
import {actionSetAppStateValid} from 'src/action/appAction';
import {Constants} from 'src/constants';
import {setBillingAddressAsValid} from 'src/library';
import {stateMock} from 'src/mocks';
import {IError, IOrderInitialization} from 'src/types';

jest.mock('src/action/appAction');
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);

describe('testing setBillingAddressAsValid', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;
    const billingError:IError = {
        address_type: Constants.BILLING,
        message: 'test error',
        type: 'test',
        field: 'test',
        severity: 'test',
        sub_type: 'testing billing'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
    });

    test('calling set billing as valid with no billing errors', async () => {
        await setBillingAddressAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('billingAddress', true);
    });

    test('calling set billing as valid with billing errors', async () => {
        getState().errors = [billingError];
        await setBillingAddressAsValid(dispatch, getState);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
    });
});
