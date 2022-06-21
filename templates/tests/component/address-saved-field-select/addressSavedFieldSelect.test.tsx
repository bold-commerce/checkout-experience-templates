import {IAddressFieldSelectProps, ISavedAddressHookProps, ISelectList} from 'src/types';
import {Constants} from 'src/constants';
import * as useGetSavedAddressData from 'src/hooks/useGetSavedAddressData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AddressSavedSelect} from 'src/components';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetIsLoading} from 'src/hooks';
import {IAddress} from '@bold-commerce/checkout-frontend-library';

jest.mock('src/hooks/useGetIsLoading');
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

describe('Testing AddressSavedSelect component', () => {
    let addressHook: jest.SpyInstance;

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
        useGetIsLoadingMock.mockReturnValue(false);
    });

    test('Render the AddressSavedSelect properly', () => {
        addressHook = jest.spyOn(useGetSavedAddressData, 'useGetSavedAddressData').mockReturnValue(hookResult);
        const {container} = render(<AddressSavedSelect {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
    });

    test('test the change event', () => {
        addressHook = jest.spyOn(useGetSavedAddressData, 'useGetSavedAddressData').mockReturnValue(hookResult);
        render(<AddressSavedSelect {...props}/>);
        const input = screen.getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

});
