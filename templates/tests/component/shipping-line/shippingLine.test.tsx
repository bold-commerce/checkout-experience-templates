import {render} from '@testing-library/react';
import {ShippingLine} from 'src/components';
import React from 'react';
import * as useGetShippingLinesData from 'src/hooks/useGetShippingLinesData';
import {IApplicationStateSelectShippingLine, IApplicationStateShippingAvailableLine} from 'src/types';
import resetAllMocks = jest.resetAllMocks;

describe('Testing shipping line component', () => {
    let useGetShippingLinesDataSpy: jest.SpyInstance;

    const selectShippingLine1: IApplicationStateSelectShippingLine = {
        id: '1',
        description: 'test 1',
        amount: 100
    };
    const selectShippingLine2: IApplicationStateSelectShippingLine = {
        id: '2',
        description: 'test 2',
        amount: 200
    };
    const shippingLine1: IApplicationStateShippingAvailableLine = {
        id: 1,
        line: selectShippingLine1
    };
    const shippingLine2: IApplicationStateShippingAvailableLine = {
        id: 1,
        line: selectShippingLine2
    };
    const dataArray = [
        {
            name: 'Render shipping line properly with zero shipping lines',
            parameter: {shippingLines: [], selectedLine: null, handleChange: jest.fn(), shippingLinesLength: 0},
            called: 1,
            lineItemsLength: 0,
            lineDescriptionLength: 0,
            noShippingText: 1
        },
        {
            name: 'Render shipping line properly with one shipping line',
            parameter: {shippingLines: [shippingLine1], selectedLine: selectShippingLine1, handleChange: jest.fn(), shippingLinesLength: 1},
            called: 1,
            lineItemsLength: 1,
            lineDescriptionLength: 1,
            noShippingText: 0
        },
        {
            name: 'Render shipping line properly with multiple shipping lines',
            parameter: {shippingLines: [shippingLine1, shippingLine2],
                selectedLine: selectShippingLine1, handleChange: jest.fn() ,shippingLinesLength: 2},
            called: 1,
            lineItemsLength: 2,
            lineDescriptionLength: 2,
            noShippingText: 0
        }
    ];

    beforeEach(() => {
        resetAllMocks();
        useGetShippingLinesDataSpy = jest.spyOn(useGetShippingLinesData, 'useGetShippingLinesData');
    });

    test.each(dataArray)( '$name', async ({name, parameter, called, lineItemsLength, lineDescriptionLength, noShippingText}) => {
        useGetShippingLinesDataSpy.mockReturnValueOnce(parameter);

        const {container} = render(<ShippingLine/>);
        expect(useGetShippingLinesDataSpy).toHaveBeenCalledTimes(called);
        expect(container.getElementsByClassName('shipping_line__items').length).toBe(lineItemsLength);
        expect(container.getElementsByClassName('shipping_line__items-description').length).toBe(lineDescriptionLength);
        expect(container.getElementsByClassName('shipping-line__no-valid-address-label').length).toBe(noShippingText);

    });
});
