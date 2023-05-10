import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {ShippingLine} from 'src/components';
import {useGetIsLoadingExceptSections, useGetShippingLinesData} from 'src/hooks';
import { IShippingLineProps, IShippingLinesHookProps} from 'src/types';
import resetAllMocks = jest.resetAllMocks;

jest.mock('src/hooks/useGetIsLoadingExceptSections');
jest.mock('src/hooks/useGetShippingLinesData');
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);
const useGetShippingLinesDataMock = mocked(useGetShippingLinesData, true);

type Data = {
    name: string;
    parameter: IShippingLinesHookProps;
    selectors: Record<string, number>;
    called: number;
    props?: IShippingLineProps;
}

describe('Testing shipping line component', () => {

    const selectShippingLine1: IShippingLine = {
        id: '1',
        description: 'test 1',
        amount: 100
    };
    const selectShippingLine2: IShippingLine = {
        id: '2',
        description: 'test 2',
        amount: 200
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
            },
            selectors: {
                '.shipping_line__items': 0,
                '.shipping_line__items-border': 0,
                '.shipping_line__items-description': 0,
                '.shipping-line__no-valid-address-label': 1,
                '.shipping-line__block': 0,
            },
            called: 1,
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
        },
    ];

    beforeEach(() => {
        resetAllMocks();
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
        jest.resetAllMocks();
    });

    test.each(dataArray)('$name', async ({parameter, called, selectors, props = {}}) => {
        useGetShippingLinesDataMock.mockReturnValueOnce(parameter);

        const {container} = render(<ShippingLine {...props} />);
        expect(useGetShippingLinesDataMock).toHaveBeenCalledTimes(called);
        for (const [ selector, expectedLength ] of Object.entries(selectors)) {
            expect(container.querySelectorAll(selector)).toHaveLength(expectedLength);
        }
    });
});
