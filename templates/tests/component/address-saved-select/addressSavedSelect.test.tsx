import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {fireEvent, render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {AddressSavedSelect} from 'src/components';
import {Constants} from 'src/constants';
import {useGetIsLoadingExceptSections, useGetSavedAddressData} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {IAddressFieldSelectProps, IAddressSavedSelectProps, ISavedAddressHookProps, ISelectList} from 'src/types';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetSavedAddressData');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);

type RenderTestData = {
    name: string;
    hookReturnValue: ISavedAddressHookProps;
    addressSavedSelectProps: IAddressSavedSelectProps;
    selectors: Record<string, number>;
}

describe('Testing AddressSavedSelect component', () => {
    const savedAddresses: Array<IAddress> = initialDataMock.application_state.customer.saved_addresses;
    const props: IAddressFieldSelectProps = {
        type: Constants.SHIPPING,
        className: 'test-class',
        debounceApiCall: () => jest.fn()
    };
    const options: Array<ISelectList>= [
        {name:'option1', value: 'option1'},
        {name:'option2', value: 'option2'}
    ];
    const hookResult: ISavedAddressHookProps = {
        placeholder: 'test',
        title: 'test',
        label: 'test-label',
        selectedOptionId: undefined,
        id: 'test-id',
        options: options,
        savedAddresses: savedAddresses,
        handleChange: jest.fn()
    };
    const renderTestData: RenderTestData[] = [
        {
            name: 'Render AddressSavedSelect properly',
            hookReturnValue: hookResult,
            addressSavedSelectProps: props,
            selectors: {
                [`.${props.className}`]: 1,
                'option[value=""]': 1,
            },
        },
        {
            name: 'Rende AddressSavedSelect properly selectedAddressId being in the options',
            hookReturnValue: {
                ...hookResult,
                selectedOptionId: hookResult.options[0].value
            },
            addressSavedSelectProps: {
                ...props,
                autoSelect: true,
            },
            selectors: {
                [`option[value="${hookResult.options[0].value}"]:checked`]: 1,
            },
        },
        {
            name: 'Render AddressSavedSelect should not auto select if autoSelect props is false or undefined',
            hookReturnValue: {
                ...hookResult,
                selectedOptionId: hookResult.options[0].value
            },
            addressSavedSelectProps: props,
            selectors: {
                [`option[value="${hookResult.options[0].value}"]:not(:checked)`]: 1,
            },
        },
        {
            name: 'Render AddressSavedSelect should render with one option that has placeholder value',
            hookReturnValue: {
                ...hookResult,
                selectedOptionId: hookResult.options[0].value
            },
            addressSavedSelectProps: {
                ...props,
                placeholderValue: 'test-placeholder',
            },
            selectors: {
                'option[value="test-placeholder"]': 1,
                'option[value=""]': 0,
            },
        }
    ];

    afterEach(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });


    test.each(renderTestData)('$name', ({
        hookReturnValue,
        addressSavedSelectProps,
        selectors,
    }) => {
        useGetSavedAddressDataMock.mockReturnValueOnce(hookReturnValue);

        const { container } = render(<AddressSavedSelect {...addressSavedSelectProps} />);

        for (const [ selector, expectedLength ] of Object.entries(selectors)) {
            const selectedElements = container.querySelectorAll(selector);
            expect(selectedElements).toHaveLength(expectedLength);
        }
    });

    test('test the change event', () => {
        useGetSavedAddressDataMock.mockReturnValueOnce(hookResult);

        const { getByTestId } = render(<AddressSavedSelect {...props}/>);

        const input = getByTestId('input-select');
        fireEvent.change(input, {target: {value: 'a'}});

        expect(hookResult.handleChange).toHaveBeenCalledTimes(1);
    });

    test('Render with autoSelect=true and selectedOptionId=option1', () => {
        useGetSavedAddressDataMock.mockReturnValueOnce({
            ...hookResult,
            selectedOptionId: options[0].value,
        });

        const { container } = render(<AddressSavedSelect {...props} autoSelect={true} />);

        const option = container.querySelector<HTMLOptionElement>('option[value="option1"]');
        expect(option?.selected).toBeTruthy();
    });

    test('Render with placeholder override', () => {
        useGetSavedAddressDataMock.mockReturnValueOnce(hookResult);

        const addressSavedSelectProps = {
            ...props,
            placeholderValue: 'custom-placeholder',
        };

        const { container } = render(<AddressSavedSelect {...addressSavedSelectProps}/>);

        const option = container.querySelector<HTMLOptionElement>('option[value="custom-placeholder"');
        expect(option?.innerHTML).toBe('custom-placeholder');
    });
});
