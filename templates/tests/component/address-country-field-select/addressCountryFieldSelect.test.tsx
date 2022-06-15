import {IAddressCountryHookProps, IAddressFieldSelectProps, ISelectList} from 'src/types';
import {Constants} from 'src/constants';
import * as useGetAddressCountryInputData from 'src/hooks/useGetAddressCountrySelectData';
import {fireEvent, render} from '@testing-library/react';
import {AddressCountrySelect} from 'src/components';
import {mocked} from 'jest-mock';
import {useGetIsLoading} from 'src/hooks';

jest.mock('src/hooks/useGetIsLoading');
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

describe('Testing AddressCountrySelect component', () => {
    const addressHook = jest.spyOn(useGetAddressCountryInputData, 'useGetAddressCountryInputData');

    const props: IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };

    const options: Array<ISelectList> = [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];

    const hookResult: IAddressCountryHookProps = {
        placeholder: 'test',
        label: 'test-label',
        id: 'test-id',
        name: 'test-name',
        value: 'option1',
        countryOptions: options,
        countryName: 'Option 1',
        handleChange: jest.fn()
    };

    beforeEach(() => {
        useGetIsLoadingMock.mockReturnValue(false);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('Render the AddressCountrySelect properly', () => {
        addressHook.mockReturnValue(hookResult);

        const { container, getByText } = render(<AddressCountrySelect {...props}/>);

        expect(container.getElementsByClassName('address__country').length).toBe(1);
        const element: Partial<HTMLSelectElement> = container.getElementsByTagName('select')[0];
        expect(element.id).toBe(hookResult.id);
        expect(element.value).toBe(hookResult.value);
        expect(element.name).toBe(hookResult.name);
        expect((getByText(hookResult.value) as HTMLOptionElement).selected).toBeTruthy();
    });

    test('test the change event', () => {
        addressHook.mockReturnValue(hookResult);

        const { getByTestId } = render(<AddressCountrySelect {...props}/>);

        const input = getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});
        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

    test('Unsupported country is rendered as an option until changed', () => {
        addressHook.mockReturnValue({
            ...hookResult,
            countryName: 'Test Country',
            value: 'test-country',
            handleChange: jest.fn(),
        });

        const { container, rerender } = render(<AddressCountrySelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(4);
        expect(container.querySelector('[value="test-country"]')).toBeTruthy();
        expect(container.querySelector('[value="test-country"]')?.textContent).toBe('Test Country');

        // Changing the country to a supported country
        addressHook.mockReturnValue({
            ...hookResult,
            countryName: hookResult.countryOptions[0].name,
            value: hookResult.countryOptions[0].value,
        });
        rerender(<AddressCountrySelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(3);
        expect(container.querySelector('[value="test-country"]')).toBeFalsy();
    });

    test('Unsupported country is rendered using country code instead of name', () => {
        addressHook.mockReturnValue({
            ...hookResult,
            countryName: undefined,
            value: 'test-country',
            handleChange: jest.fn(),
        });

        const { container } = render(<AddressCountrySelect {...props} />);

        expect(container.getElementsByTagName('option')).toHaveLength(4);
        expect(container.querySelector('[value="test-country"]')).toBeTruthy();
        expect(container.querySelector('[value="test-country"]')?.textContent).toBe('test-country');
    });
});
