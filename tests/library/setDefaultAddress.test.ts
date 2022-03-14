import {actionUpdateAddress} from 'src/action';
import { Constants } from 'src/constants';
import { validateShippingAddress, setDefaultShippingAddress } from 'src/library';
import { initialDataMock, stateMock } from 'src/mocks';
import { IAddress, IOrderInitialization } from 'src/types';

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
    test('set default address properly', () => {

        setDefaultShippingAddress(dispatch, getState)
        expect(dispatch).toBeCalledWith(actionUpdateAddress(Constants.SHIPPING, savedAddresses[0]));
        expect(dispatch).toBeCalledWith(validateShippingAddress);
        expect(dispatch).toHaveBeenCalledTimes(2);
    });
});
