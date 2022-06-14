import { render } from '@testing-library/react';
import { AddressSavedFieldRadioList } from 'src/components';
import { IAddress, ISavedAddressFieldRadioListProps, ISavedAddressHookProps } from 'src/types';
import { initialDataMock } from 'src/mocks';
import { useGetSavedAddressData, useGetShippingData } from 'src/hooks';
import { mocked } from 'jest-mock';
import { Constants } from 'src/constants';
import { Provider } from 'react-redux';
import * as Store from 'src/store';
import { getTerm } from 'src/utils';

jest.mock('src/hooks/useGetSavedAddressData');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/utils/getTerm');
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const getTermMock = mocked(getTerm, true);

const store = Store.initializeStore();

describe('Testing AddressSavedFieldRadioList component', () => {
    const savedAddresses: Array<IAddress> = [
        {...initialDataMock.application_state.addresses.shipping, id: '1'} as IAddress, 
        {...initialDataMock.application_state.addresses.billing, id: '2'} as IAddress
    ];
    const shippingData: IAddress = savedAddresses[0];

    const savedAddressData: ISavedAddressHookProps = {
        placeholder: 'test',
        title: 'test',
        label: 'test-label',
        selectedOptionId: undefined,
        id: 'test-id',
        options: [],
        savedAddresses: savedAddresses,
        handleChange: jest.fn()
    };

    const props: ISavedAddressFieldRadioListProps = {
        type: Constants.SHIPPING
    };

    test('Render the AddressSavedFieldRadioList properly', () => {
        useGetSavedAddressDataMock.mockReturnValue(savedAddressData);
        useGetShippingDataMock.mockReturnValue(shippingData);
        getTermMock.mockReturnValue('Shipping address');

        const {container} = render(<Provider store={store}><AddressSavedFieldRadioList {...props}/></Provider>);
        
        expect(container.getElementsByClassName('saved-address-list').length).toBe(1);
        expect(container.getElementsByClassName('saved-address-list-item').length).toBe(3);
    });
});
