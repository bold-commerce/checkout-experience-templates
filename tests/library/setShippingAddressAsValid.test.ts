import {Dispatch} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks';
import * as setValues from 'src/action/appAction';
import {setShippingAddressAsValid} from 'src/library';
import {Constants} from 'src/constants';

describe('testing postShippingLines', () => {
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;
    let setValidSpy: jest.SpyInstance;
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
        setValidSpy = jest.spyOn(setValues, 'actionSetAppStateValid');
    });

    test('calling post shipping address endpoint with  getState returning a different data structure', async () => {
        await setShippingAddressAsValid(dispatch, getState);
        expect(setValidSpy).toHaveBeenCalledTimes(2);
    });

    test('calling post shipping address endpoint with  getState returning a different data structure', async () => {
        getState().errors = [shippingError];
        await setShippingAddressAsValid(dispatch, getState);
        expect(setValidSpy).toHaveBeenCalledTimes(0);
    });
});
