import { render } from '@testing-library/react';
import { AddressSavedFieldRadioList } from 'src/components';
import { ISavedAddressFieldRadioListProps, ISavedAddressHookProps } from 'src/types';
import {initialDataMock, storeMock} from 'src/mocks';
import { useGetSavedAddressData, useGetShippingData } from 'src/hooks';
import { mocked } from 'jest-mock';
import { Constants } from 'src/constants';
import { getTerm } from 'src/utils';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/hooks/useGetSavedAddressData');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/utils/getTerm');
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const getTermMock = mocked(getTerm, true);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

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

        const {container} = render(<AddressSavedFieldRadioList {...props}/>);

        expect(container.getElementsByClassName('saved-address-list').length).toBe(1);
        expect(container.getElementsByClassName('saved-address-list-item').length).toBe(3);
    });
});
