import {Constants} from 'src/constants';
import * as deleteShippingAddress from 'src/library/deleteShippingAddress';
import * as deleteBillingAddress from 'src/library/deleteBillingAddress';
import {Dispatch} from 'redux';
import {deleteAddress} from 'src/library';

describe('testing deleteAddress', () => {
    const deleteShippingAddressSpy = jest.spyOn(deleteShippingAddress, 'deleteShippingAddress');
    const deleteBillingAddressSpy = jest.spyOn(deleteBillingAddress, 'deleteBillingAddress');
    let dispatchMock: Dispatch;
    const calledOnce = 1;
    const dataArray = [
        {
            name: 'call delete address for shipping',
            parameter: Constants.SHIPPING,
            called: calledOnce,
            spyFunction: deleteShippingAddressSpy
        },
        {
            name: 'call delete address for billing',
            parameter: Constants.BILLING,
            called: calledOnce,
            spyFunction: deleteBillingAddressSpy
        }
    ];

    beforeEach(() => {
        dispatchMock = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataArray)( '$0', async ({name, parameter, called, spyFunction}) => {
        const postAddressValue = await deleteAddress(parameter);
        postAddressValue(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(called);
            expect(dispatchMock).toHaveBeenCalledWith(spyFunction);
        });
    });

});
