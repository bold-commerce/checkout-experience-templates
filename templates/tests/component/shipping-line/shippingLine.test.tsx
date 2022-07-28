import {render} from '@testing-library/react';
import {ShippingLine} from 'src/components';
import * as useGetShippingLinesData from 'src/hooks/useGetShippingLinesData';
import { IShippingLineProps, IShippingLinesHookProps} from 'src/types';
import resetAllMocks = jest.resetAllMocks;
import {IShippingLine} from '@bold-commerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {useGetIsLoading} from 'src/hooks';

jest.mock('src/hooks/useGetIsLoading');
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

type Data = {
    name: string;
    parameter: IShippingLinesHookProps;
    selectors: Record<string, number>;
    called: number;
    props?: IShippingLineProps;
}

describe('Testing shipping line component', () => {
    let useGetShippingLinesDataSpy = jest.spyOn(useGetShippingLinesData, 'useGetShippingLinesData');

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
        useGetShippingLinesDataSpy = jest.spyOn(useGetShippingLinesData, 'useGetShippingLinesData');
        useGetIsLoadingMock.mockReturnValue(false);
        jest.resetAllMocks();
    });

    test.each(dataArray)('$name', async ({parameter, called, selectors, props = {}}) => {
        useGetShippingLinesDataSpy.mockReturnValueOnce(parameter);

        const {container} = render(<ShippingLine {...props} />);
        expect(useGetShippingLinesDataSpy).toHaveBeenCalledTimes(called);
        for (const [ selector, expectedLength ] of Object.entries(selectors)) {
            expect(container.querySelectorAll(selector)).toHaveLength(expectedLength);
        }
    });
});
