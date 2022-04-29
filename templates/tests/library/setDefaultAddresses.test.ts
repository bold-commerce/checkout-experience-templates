import {actionUpdateAddress, actionUpdateBillingType, actionUpdateBillingTypeInSettings} from 'src/action';
import { Constants, defaultAddressState } from 'src/constants';
import { validateShippingAddress, setDefaultAddresses, validateBillingAddress, setShippingAddressAsValid, setBillingAddressAsValid } from 'src/library';
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
    });

    afterEach(() => {
        jest.resetAllMocks();
    })

    test('resume checkout, validate addresses', async () => {
        await setDefaultAddresses(dispatch, getState)
        expect(dispatch).toBeCalledWith(setShippingAddressAsValid);
        expect(dispatch).toBeCalledWith(setBillingAddressAsValid);

        expect(dispatch).toHaveBeenCalledTimes(2);
    });

    test('set default addresses properly', async () => {
        stateMock.data.application_state.addresses.shipping = defaultAddressState;
        stateMock.data.application_state.addresses.billing = defaultAddressState;
        
        await setDefaultAddresses(dispatch, getState)
        expect(dispatch).toBeCalledWith(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        expect(dispatch).toBeCalledWith(validateShippingAddress);

        expect(dispatch).toBeCalledWith(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        expect(dispatch).toBeCalledWith(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));
        expect(dispatch).toBeCalledWith(validateBillingAddress);

        expect(dispatch).toHaveBeenCalledTimes(5);
    });
});
