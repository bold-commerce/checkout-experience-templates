import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks/stateMock';
import {mocked} from 'ts-jest/utils';
import {deleteBillingAddress as deleteAddress} from '@bold-commerce/checkout-frontend-library';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import * as applicationState  from 'src/library/applicationState';
import {deleteBillingAddress} from 'src/library';

jest.mock('@bold-commerce/checkout-frontend-library');
const deleteBillingAddressMock = mocked(deleteAddress, true);

describe('testing deleteBillingAddress', () => {

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


    test('calling delete billing address with success', async () => {
        returnObject.success = true;
        deleteBillingAddressMock.mockReturnValue(returnObject);

        deleteBillingAddress(dispatch, getState).then(() => {
            expect(deleteBillingAddressMock).toHaveBeenCalledTimes(calledOnce);
            expect(handleErrorSpy).toHaveBeenCalledTimes(calledOnce);
            expect(getAppStateSpy).toHaveBeenCalledTimes(calledOnce);
        });
    });


});
