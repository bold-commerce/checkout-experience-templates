import {render} from '@testing-library/react';
import {ShippingLines} from 'src/components';
import * as Store from 'src/store';
import {Provider} from 'react-redux';
import React from 'react';
import * as getShippingLines from 'src/hooks/useGetShippingLines';
import resetAllMocks = jest.resetAllMocks;

const store = Store.initializeStore();
const component =
    <Provider store={store}>
        <ShippingLines/>
    </Provider>;

describe('Testing shipping lines component', () => {
    let getShippingLinesSpy: jest.SpyInstance;

    const zero = 0;
    const one = 1;
    const dataArray = [
        {
            name: 'Render the default ShippingLines properly',
            loadingParameter: false,
            validParameter: false,
            shippingLineLabelLength: one,
            shippingLineBlockLength: zero,
            shippingLinesLength: one,
            shippingLinesCalled: one,
        },
        {
            name: 'Render the ShippingLines properly when loading is true and valid is false',
            loadingParameter: true,
            validParameter: false,
            shippingLineLabelLength: one,
            shippingLineBlockLength: zero,
            shippingLinesLength: one,
            shippingLinesCalled: one,
        },
        {
            name: 'Render the ShippingLines properly when loading is false and valid is true',
            loadingParameter: false,
            validParameter: true,
            shippingLineLabelLength: zero,
            shippingLineBlockLength: one,
            shippingLinesLength: one,
            shippingLinesCalled: one,
        },
        {
            name: 'Render the ShippingLines properly when loading is true and valid is true',
            loadingParameter: true,
            validParameter: true,
            shippingLineLabelLength: zero,
            shippingLineBlockLength: zero,
            shippingLinesLength: one,
            shippingLinesCalled: one,
        }
    ];

    beforeEach(() => {
        resetAllMocks();
        getShippingLinesSpy = jest.spyOn(getShippingLines, 'useGetShippingLines');
    });

    test.each(dataArray)( '$0', async ({name, loadingParameter, validParameter, shippingLineLabelLength, shippingLineBlockLength, shippingLinesLength, shippingLinesCalled}) => {
        getShippingLinesSpy.mockReturnValueOnce({loading: loadingParameter, isValidAddress: validParameter, notValidText: 'testText1', fieldSectionText: 'testText2'});
        const {container} = render(component);
        expect(container.getElementsByClassName('shipping-line__no-valid-address-label').length).toBe(shippingLineLabelLength);
        expect(container.getElementsByClassName('shipping-line__block').length).toBe(shippingLineBlockLength);
        expect(container.getElementsByClassName('shipping-lines').length).toBe(shippingLinesLength);
        expect(getShippingLinesSpy).toHaveBeenCalledTimes(shippingLinesCalled);
    });
});
