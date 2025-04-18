import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {ShippingLine} from 'src/components';
import {useGetIsLoadingExceptSections, useGetShippingLinesData, useGetShippingLinesDataNoDebounce} from 'src/hooks';
import {IShippingLineProps, IShippingLinesHookProps} from 'src/types';
import resetAllMocks = jest.resetAllMocks;
import {initialDataMock} from 'src/mocks';

jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetShippingLinesData');
jest.mock('src/hooks/useGetShippingLinesDataNoDebounce');
const store = {
    data: initialDataMock,
    isValid: {},
};
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
}));
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetShippingLinesDataMock = mocked(useGetShippingLinesData, true);
const useGetShippingLinesDataNoDebounceMock = mocked(useGetShippingLinesDataNoDebounce, true);


type Data = {
    name: string;
    parameter: IShippingLinesHookProps;
    selectors: Record<string, number>;
    called: number;
    calledNoDebounce: number;
    props?: IShippingLineProps;
}

describe('Testing shipping line component', () => {

    const selectShippingLine1: IShippingLine = {
        id: '1',
        description: 'test 1',
        amount: 100,
        code: '',
    };
    const selectShippingLine2: IShippingLine = {
        id: '2',
        description: 'test 2',
        amount: 200,
        code: '',
    };
    const dataArray: Data[] = [
        {
            name: 'Render shipping line properly with zero shipping lines',
            parameter: {
                shippingLines: [],
                selectedLine: null,
                handleChange: jest.fn(),
                shippingLinesLength: 0,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 0,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 0,
                '.shipping-line__no-valid-address-label': 1,
                '.shipping-line__block': 0,
            },
            called: 1,
            calledNoDebounce: 0,
        },
        {
            name: 'Render shipping line properly with zero shipping lines & show no rates as alert',
            parameter: {
                shippingLines: [],
                selectedLine: null,
                handleChange: jest.fn(),
                shippingLinesLength: 0,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 0,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 0,
                '.shipping-line__no-valid-address-label': 0,
                '.flash-error__container': 1,
                '.flash-error__text': 1,
                '.shipping-line__block': 0,
            },
            props: {
                showNoRatesAsAlert: true,
            },
            called: 1,
            calledNoDebounce: 0,
        },
        {
            name: 'Render shipping line properly with one shipping line and no selected line',
            parameter: {
                shippingLines: [selectShippingLine1],
                selectedLine: null,
                handleChange: jest.fn(),
                shippingLinesLength: 1,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 1,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 1,
                '.shipping-line__no-valid-address-label': 0,
                '.shipping-line__block': 0,
                'input[type="radio"][checked]': 0,
            },
            called: 1,
            calledNoDebounce: 0,
        },
        {
            name: 'Render shipping line properly with one shipping line',
            parameter: {
                shippingLines: [selectShippingLine1],
                selectedLine: selectShippingLine1,
                handleChange: jest.fn(),
                shippingLinesLength: 1,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 1,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 1,
                '.shipping-line__no-valid-address-label': 0,
                '.shipping-line__block': 0,
                'input[type="radio"][checked]': 1,
            },
            called: 1,
            calledNoDebounce: 0,
        },
        {
            name: 'Render shipping line properly with one shipping line. no debounce',
            props: {
                theme: 'three-page',
            },
            parameter: {
                shippingLines: [selectShippingLine1],
                selectedLine: selectShippingLine1,
                handleChange: jest.fn(),
                shippingLinesLength: 1,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 1,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 1,
                '.shipping-line__no-valid-address-label': 0,
                '.shipping-line__block': 0,
                'input[type="radio"][checked]': 1,
            },
            called: 0,
            calledNoDebounce: 1,
        },
        {
            name: 'Render shipping line properly with multiple shipping lines',
            parameter: {
                shippingLines: [selectShippingLine1, selectShippingLine2],
                selectedLine: selectShippingLine1,
                handleChange: jest.fn(),
                shippingLinesLength: 2,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 2,
                '.shipping_line__items-border': 1,
                '.shipping_line__items-description': 2,
                '.shipping-line__no-valid-address-label': 0,
                '.shipping-line__block': 0,
                'input[type="radio"][checked]': 1,
            },
            called: 1,
            calledNoDebounce: 0,
        },
        {
            name: 'Render shipping lines in block when showNoRatesAsAlert is true',
            props: {
                showNoRatesAsAlert: true,
            },
            parameter: {
                shippingLines: [selectShippingLine1, selectShippingLine2],
                selectedLine: selectShippingLine1,
                handleChange: jest.fn(),
                shippingLinesLength: 2,
                shippingAddressValid: true,
                noShippingAreaText: 'No shipping available',
                formattedPrice: '${{amount}}',
                useShippingLineCode: false,
            },
            selectors: {
                '.shipping_line__items': 2,
                '.shipping_line__items-border': 1,
                '.shipping_line__items-description': 2,
                '.shipping-line__no-valid-address-label': 0,
                '.shipping-line__block': 1,
                'input[type="radio"][checked]': 1,
            },
            called: 1,
            calledNoDebounce: 0,
        },
    ];

    beforeEach(() => {
        resetAllMocks();
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        jest.resetAllMocks();
    });

    test.each(dataArray)('$name', async ({parameter, called, calledNoDebounce, selectors, props = {}}) => {
        useGetShippingLinesDataMock.mockReturnValueOnce(parameter);
        useGetShippingLinesDataNoDebounceMock.mockReturnValueOnce(parameter);

        const {container} = render(<ShippingLine {...props} />);
        expect(useGetShippingLinesDataMock).toHaveBeenCalledTimes(called);
        expect(useGetShippingLinesDataNoDebounceMock).toHaveBeenCalledTimes(calledNoDebounce);
        for (const [ selector, expectedLength ] of Object.entries(selectors)) {
            expect(container.querySelectorAll(selector)).toHaveLength(expectedLength);
        }
    });
});
