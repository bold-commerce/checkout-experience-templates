import {actionUpdateAddress, actionUpdateBillingType, actionUpdateBillingTypeInSettings} from 'src/action';
import { Constants } from 'src/constants';
import { validateShippingAddress, setDefaultAddresses, validateBillingAddress } from 'src/library';
import { initialDataMock, stateMock } from 'src/mocks';
import { IAddress } from 'src/types';

describe('Testing hook useSetDefaultAddress', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const savedAddresses = [
        initialDataMock.application_state.addresses.shipping as IAddress, 
        initialDataMock.application_state.addresses.billing as IAddress
    ];
    stateMock.data.application_state.customer.saved_addresses = savedAddresses;

    beforeEach(() => {
        getState.mockReturnValue(stateMock);
    })
    test('set default addresses properly', async () => {

        await setDefaultAddresses(dispatch, getState)
        expect(dispatch).toBeCalledWith(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        expect(dispatch).toBeCalledWith(validateShippingAddress);

        expect(dispatch).toBeCalledWith(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        expect(dispatch).toBeCalledWith(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));
        expect(dispatch).toBeCalledWith(validateBillingAddress);

        expect(dispatch).toHaveBeenCalledTimes(5);
    });
});
