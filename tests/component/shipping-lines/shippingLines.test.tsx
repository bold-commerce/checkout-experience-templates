import {render} from '@testing-library/react';
import {ShippingLines} from 'src/components';
import React from 'react';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetRequiresShipping, useGetShippingLines} from 'src/hooks';

const store = {
    data: initialDataMock,
    appSetting: {autocompleteService: 'test'},
    isValid: {orderProcessed: true}
};

jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => jest.fn()
}));
jest.mock('src/hooks/useGetShippingLines');
jest.mock('src/hooks/useGetRequiresShipping');
const getShippingLinesMock = mocked(useGetShippingLines, true);
const getRequiresShippingMock = mocked(useGetRequiresShipping, true);

describe('Testing shipping lines component', () => {

    const dataArray = [
        {
            name: 'Render the default ShippingLines properly',
            requiresShipping: true,
            loadingParameter: false,
            validParameter: false,
            shippingLineLabelLength: 1,
            shippingLineBlockLength: 0,
            shippingLinesLength: 1,
            shippingLinesCalled: 1,
        },
        {
            name: 'Render the ShippingLines properly when loading is true and valid is false',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: false,
            shippingLineLabelLength: 1,
            shippingLineBlockLength: 0,
            shippingLinesLength: 1,
            shippingLinesCalled: 1,
        },
        {
            name: 'Render the ShippingLines properly when loading is false and valid is true',
            requiresShipping: true,
            loadingParameter: false,
            validParameter: true,
            shippingLineLabelLength: 0,
            shippingLineBlockLength: 1,
            shippingLinesLength: 1,
            shippingLinesCalled: 1,
        },
        {
            name: 'Render the ShippingLines properly when loading is true and valid is true',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: true,
            shippingLineLabelLength: 0,
            shippingLineBlockLength: 0,
            shippingLinesLength: 1,
            shippingLinesCalled: 1,
        },
        {
            name: 'Not rendering the ShippingLines when requires shipping is false',
            requiresShipping: false,
            loadingParameter: true,
            validParameter: true,
            shippingLineLabelLength: 0,
            shippingLineBlockLength: 0,
            shippingLinesLength: 0,
            shippingLinesCalled: 1,
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(dataArray)( '$name', async ({name, requiresShipping, loadingParameter, validParameter, shippingLineLabelLength, shippingLineBlockLength, shippingLinesLength, shippingLinesCalled}) => {
        getShippingLinesMock.mockReturnValueOnce({loading: loadingParameter, isValidAddress: validParameter, notValidText: 'testText1', fieldSectionText: 'testText2', taxShippingText: 'text'});
        getRequiresShippingMock.mockReturnValue(requiresShipping);
        const {container} = render(<ShippingLines/>);
        expect(container.getElementsByClassName('shipping-line__no-valid-address-label').length).toBe(shippingLineLabelLength);
        expect(container.getElementsByClassName('shipping-line__block').length).toBe(shippingLineBlockLength);
        expect(container.getElementsByClassName('shipping-lines').length).toBe(shippingLinesLength);
        expect(getShippingLinesMock).toHaveBeenCalledTimes(shippingLinesCalled);
    });
});
