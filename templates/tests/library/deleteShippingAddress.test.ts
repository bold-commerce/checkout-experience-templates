import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks/stateMock';
import {mocked} from 'ts-jest/utils';
import {deleteShippingAddress as deleteAddress} from '@bold-commerce/checkout-frontend-library';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import * as applicationState  from 'src/library/applicationState';
import {deleteShippingAddress} from 'src/library';

jest.mock('@bold-commerce/checkout-frontend-library');
const deleteShippingAddressMock = mocked(deleteAddress, true);

describe('testing delete shipping address', () => {

    const returnObject = {...baseReturnObject};
    let dispatch: Dispatch;
    let getState: () => IOrderInitialization;
    const calledOnce = 1;
    let handleErrorSpy: jest.SpyInstance;
    let getAppStateSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch = jest.fn();
        getState = jest.fn().mockReturnValue(stateMock);
        handleErrorSpy = jest.spyOn(handleErrorIfNeeded, 'handleErrorIfNeeded').mockImplementation();
        getAppStateSpy = jest.spyOn(applicationState, 'getApplicationStateFromLib');
    });


    test('calling delete shipping address with success', async () => {
        returnObject.success = true;
        deleteShippingAddressMock.mockReturnValue(returnObject);

        deleteShippingAddress(dispatch, getState).then(() => {
            expect(deleteShippingAddressMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorSpy).toHaveBeenCalledTimes(calledOnce);
            expect(getAppStateSpy).toHaveBeenCalledTimes(calledOnce);
        });
    });

});
