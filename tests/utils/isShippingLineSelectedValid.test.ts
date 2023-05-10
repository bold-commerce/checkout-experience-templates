import {mocked} from 'jest-mock';
import {useGetSelectShippingLine, useGetAvailableShippingLines} from 'src/hooks';
import {IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {isShippingLineSelectedValid} from 'src/utils';

jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetAvailableShippingLines');
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const useGetAvailableShippingLinesMock = mocked(useGetAvailableShippingLines, true);

describe('testing isShippingLineSelectedValid function', () => {
    const shippingLines: Array<IShippingLine> = [
        {
            id: '0',
            description: 'some desc',
            amount: 0,
        },
        {
            id: '1',
            description: 'some desc 2',
            amount: 10,
        },
    ];
    const validSelectedShippingLine: IShippingLine = {
        id: '0',
        description: 'some desc',
        amount: 0
    };
    const invalidSelectedShippingLine: IShippingLine = {
        id: '123',
        description: 'it is a very long description for a shipping method, isn\'t it? And very expensive too...',
        amount: 1500
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('Empty shipping Lines', () => {
        useGetAvailableShippingLinesMock.mockReturnValueOnce([]);
        useGetSelectShippingLineMock.mockReturnValueOnce(validSelectedShippingLine);

        const result = isShippingLineSelectedValid();
        expect(result).toBe(false);
    });

    test('Shipping Lines populated incorrect Shipping Lines', () => {
        useGetAvailableShippingLinesMock.mockReturnValueOnce(shippingLines);
        useGetSelectShippingLineMock.mockReturnValueOnce(invalidSelectedShippingLine);

        const result = isShippingLineSelectedValid();
        expect(result).toBe(false);
    });

    test('Shipping Lines populated correct Shipping Lines', () => {
        useGetAvailableShippingLinesMock.mockReturnValueOnce(shippingLines);
        useGetSelectShippingLineMock.mockReturnValueOnce(validSelectedShippingLine);

        const result = isShippingLineSelectedValid();
        expect(result).toBe(true);
    });
});
