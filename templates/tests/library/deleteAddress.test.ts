import {Constants} from 'src/constants';
import * as deleteShippingAddress from 'src/library/deleteShippingAddress';
import * as deleteBillingAddress from 'src/library/deleteBillingAddress';
import {Dispatch} from 'redux';
import {deleteAddress} from 'src/library';

describe('testing deleteAddress', () => {
    const deleteShippingAddressSpy = jest.spyOn(deleteShippingAddress, 'deleteShippingAddress');
    const deleteBillingAddressSpy = jest.spyOn(deleteBillingAddress, 'deleteBillingAddress');
    let dispatchMock: Dispatch;
    const dataArray = [
        {
            name: 'call delete address for shipping',
            parameter: Constants.SHIPPING,
            called: 1,
            spyFunction: deleteShippingAddressSpy
        },
        {
            name: 'call delete address for billing',
            parameter: Constants.BILLING,
            called: 1,
            spyFunction: deleteBillingAddressSpy
        }
    ];

    beforeEach(() => {
        dispatchMock = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataArray)( '$name', async ({name, parameter, called, spyFunction}) => {
        const postAddressValue = await deleteAddress(parameter);
        postAddressValue(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(called);
            expect(dispatchMock).toHaveBeenCalledWith(spyFunction);
        });
    });

});
