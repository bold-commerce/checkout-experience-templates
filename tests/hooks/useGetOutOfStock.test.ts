import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetOutOfStock} from 'src/hooks';
import {IUseOutOfStock} from 'src/types';
import {getReturnToCartTermAndLink, getTerm} from 'src/utils';

jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);

describe('Testing hook useGetOutOfStock', () => {
    const shopUrl = 'test-shop.alias.com';
    const mockResponse: IUseOutOfStock = {
        returnUrl: jest.fn(),
        terms: {
            returnToCart: 'Return to cart',
            returnToProduct: 'Return to product',
            outOfStockHeader: 'Inventory Issue',
            outOfStockBody: 'Inventory Issue body'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.returnUrl = shopUrl;
        getTermMock.mockReturnValue('');

        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        getReturnToCartTermAndLinkMock.mockReturnValue({term:'return_to_cart', link: 'test-shop.alias.com'});
    });

    test('rendering the hook properly', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.terms.returnToCart)
            .mockReturnValueOnce(mockResponse.terms.returnToProduct)
            .mockReturnValueOnce(mockResponse.terms.outOfStockHeader)
            .mockReturnValueOnce(mockResponse.terms.outOfStockBody);

        const {result} = renderHook(() => useGetOutOfStock());

        result.current.returnUrl();
        expect(window.location.href).toEqual(shopUrl);
        expect(getTermMock).toHaveBeenCalledWith('return_to_cart', Constants.CUSTOMER_INFO);
        expect(getTermMock).toHaveBeenCalledWith('buy_now_return_to_product', Constants.CUSTOM);
        expect(getTermMock).toHaveBeenCalledWith('inventory_issues', Constants.OUT_OF_STOCK_INFO);
        expect(getTermMock).toHaveBeenCalledWith('unavailable_products_message', Constants.OUT_OF_STOCK_INFO);
        expect(result.current.terms).toStrictEqual(mockResponse.terms);
    });
});
