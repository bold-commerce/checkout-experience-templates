import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {AddressSavedSelect} from 'src/components';
import {Constants} from 'src/constants';
import {useGetIsLoadingExceptSections, useGetSavedAddressData} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {IAddressFieldSelectProps, ISavedAddressHookProps, ISelectList} from 'src/types';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetSavedAddressData');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);

describe('Testing AddressSavedSelect component', () => {

    const props:IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };

    const options: Array<ISelectList>= [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];

    const savedAddresses: Array<IAddress> = initialDataMock.application_state.customer.saved_addresses;

    const hookResult: ISavedAddressHookProps= {
        placeholder: 'test',
        title: 'test',
        label: 'test-label',
        id: 'test-id',
        options: options,
        savedAddresses: savedAddresses,
        handleChange: jest.fn(),
        selectedOptionId: undefined
    };

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });

    test('Render the AddressSavedSelect properly', () => {
        useGetSavedAddressDataMock.mockReturnValueOnce(hookResult);
        const {container} = render(<AddressSavedSelect {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
    });

    test('test the change event', () => {
        useGetSavedAddressDataMock.mockReturnValueOnce(hookResult);
        render(<AddressSavedSelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });
});
