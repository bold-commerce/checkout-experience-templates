import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetSessionExpired} from 'src/hooks';
import {IUseSessionExpired} from 'src/types';
import {getErrorTerm, getTerm} from 'src/utils';

jest.mock('src/utils');
const getTermMock = mocked(getTerm, true);
const getErrorTermMock = mocked(getErrorTerm, true);

describe('Testing hook useGetSessionExpired', () => {
    const shopUrl = 'test-shop.alias.com';
    const mockResponse: IUseSessionExpired = {
        returnUrl: jest.fn(),
        terms: {
            returnToCart: 'Return to cart',
            sessionExpiredHeader: 'session expired',
            sessionExpiredBody: 'return to cart and try again'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.returnUrl = shopUrl;
        getTermMock.mockReturnValue('');
        getErrorTermMock.mockReturnValue('');

        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
    });

    test('rendering the hook properly', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.terms.returnToCart);
        getErrorTermMock
            .mockReturnValueOnce(mockResponse.terms.sessionExpiredHeader)
            .mockReturnValueOnce(mockResponse.terms.sessionExpiredBody);

        const {result} = renderHook(() => useGetSessionExpired());

        result.current.returnUrl();
        expect(window.location.href).toEqual(shopUrl);
        expect(getTermMock).toHaveBeenCalledWith('return_to_cart', Constants.CUSTOMER_INFO, undefined, 'Return to cart');
        expect(getErrorTermMock).toHaveBeenCalledWith('session_expired', Constants.GENERIC_ERROR_INFO, undefined, 'Your checkout session expired');
        expect(getErrorTermMock).toHaveBeenCalledWith('return_to_cart_and_checkout', Constants.GENERIC_ERROR_INFO, undefined, 'Return to your cart and check out again');
        expect(result.current.terms).toStrictEqual(mockResponse.terms);
    });
});
