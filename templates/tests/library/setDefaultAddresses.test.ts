import {
    actionUpdateAddress,
    actionUpdateBillingType,
    actionUpdateBillingTypeInSettings
} from 'src/action';
import {Constants, defaultAddressState} from 'src/constants';
import {validateShippingAddress, setDefaultAddresses, validateBillingAddress} from 'src/library';
import {initialDataMock, stateMock} from 'src/mocks';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';

jest.mock('src/library/validateBillingAddress');
const validateBillingAddressMock = mocked(validateBillingAddress, true);

describe('Testing hook useSetDefaultAddress', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const savedAddresses = [
        initialDataMock.application_state.addresses.shipping as IAddress,
        initialDataMock.application_state.addresses.billing as IAddress
    ];
    stateMock.data.application_state.customer.saved_addresses = savedAddresses;
    const validateBillingAddressThunkMock = jest.fn();

    beforeEach(() => {
        getState.mockReturnValue(stateMock);
        validateBillingAddressMock.mockReturnValue(validateBillingAddressThunkMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('resume checkout, validate addresses', async () => {
        await setDefaultAddresses(dispatch, getState);
        expect(dispatch).not.toBeCalledWith(validateShippingAddress);
        expect(validateBillingAddressMock).not.toHaveBeenCalledWith(true);

        expect(dispatch).not.toBeCalledWith(actionUpdateAddress(expect.anything(), expect.anything()));

        expect(dispatch).not.toBeCalledWith(actionUpdateBillingTypeInSettings(expect.anything()));
        expect(dispatch).not.toBeCalledWith(actionUpdateBillingType(expect.anything(), expect.anything()));
    });

    test('set default addresses properly', async () => {
        stateMock.data.application_state.addresses.shipping = defaultAddressState;
        stateMock.data.application_state.addresses.billing = defaultAddressState;
        
        await setDefaultAddresses(dispatch, getState);
        expect(dispatch).toBeCalledWith(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));

        expect(dispatch).toBeCalledWith(actionUpdateBillingTypeInSettings(Constants.SHIPPING_SAME));
        expect(dispatch).toBeCalledWith(actionUpdateBillingType(Constants.SHIPPING_SAME, savedAddresses[0]));

        expect(dispatch).toBeCalledWith(validateShippingAddress);
        expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(validateBillingAddressMock).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledTimes(5);
    });
});
