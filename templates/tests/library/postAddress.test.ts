import {Dispatch} from 'redux';
import {Constants} from 'src/constants';
import {postAddress, postShippingAddress, postBillingAddress} from 'src/library';

describe('testing postAddress', () => {
    let dispatchMock: Dispatch;
    const dataArray = [
        {
            name: 'call post address for shipping',
            parameter: Constants.SHIPPING,
            called: 1,
            paramFunction: postShippingAddress
        },
        {
            name: 'call post address for billing',
            parameter: Constants.BILLING,
            called: 1,
            paramFunction: postBillingAddress
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        dispatchMock = jest.fn();
    });

    test.each(dataArray)( '$name', async ({parameter, called, paramFunction}) => {
        const postAddressValue = await postAddress(parameter);
        await postAddressValue(dispatchMock).then(() => {
            expect(dispatchMock).toHaveBeenCalledTimes(called);
            expect(dispatchMock).toHaveBeenCalledWith(paramFunction);
        });
    });

});
