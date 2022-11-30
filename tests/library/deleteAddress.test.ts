import {Dispatch} from 'redux';
import {Constants} from 'src/constants';
import {deleteAddress, deleteShippingAddress, deleteBillingAddress} from 'src/library';

describe('testing deleteAddress', () => {
    let dispatchMock: Dispatch;
    const dataArray = [
        {
            name: 'call delete address for shipping',
            parameter: Constants.SHIPPING,
            called: 1,
            dispatchedFunction: deleteShippingAddress
        },
        {
            name: 'call delete address for billing',
            parameter: Constants.BILLING,
            called: 1,
            dispatchedFunction: deleteBillingAddress
        }
    ];

    beforeEach(() => {
        dispatchMock = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataArray)( '$name', async ({name, parameter, called, dispatchedFunction}) => {
        const postAddressValue = await deleteAddress(parameter);
        postAddressValue(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(called);
            expect(dispatchMock).toHaveBeenCalledWith(dispatchedFunction);
        });
    });

});
