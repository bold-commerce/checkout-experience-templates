import {Dispatch} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks';
import * as setValues from 'src/action/appAction';
import {setBillingAddressAsValid} from 'src/library';
import {Constants} from 'src/constants';

describe('testing setBillingAddressAsValid', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;
    let setValidSpy: jest.SpyInstance;
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
        setValidSpy = jest.spyOn(setValues, 'actionSetAppStateValid');
    });

    test('calling set billing as valid with no billing errors', async () => {
        await setBillingAddressAsValid(dispatch, getState);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledWith('billingAddress', true);
    });

    test('calling set billing as valid with billing errors', async () => {
        getState().errors = [billingError];
        await setBillingAddressAsValid(dispatch, getState);
        expect(setValidSpy).toHaveBeenCalledTimes(0);
    });
});
