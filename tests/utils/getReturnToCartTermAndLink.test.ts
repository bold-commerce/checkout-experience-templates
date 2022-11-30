import {mocked} from 'jest-mock';
import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {getReturnToCartTermAndLink} from 'src/utils';
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);

describe('Test getReturnToCartTermAndLink function', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    const data = [
        {name: 'testing with bold platform', platform: 'bold_platform', shopAlias: 'bold-platform.com', returnUrl: 'https://bold-platform.com/cart', shopURL: 'https://bold-platform.com', expected:{term: 'return_to_store', link: 'https://bold-platform.com' }},
        {name: 'testing with shopify', platform: 'shopify', shopAlias: 'shopify-test.com', returnUrl: 'https://shopify-test.com/cart', shopURL: 'https://shopify-test.com', expected:{term: 'return_to_cart', link: 'https://shopify-test.com/cart' }}
    ];

    test.each(data)(
        '$name',
        ({ platform, shopAlias, shopURL, returnUrl, expected}) => {

            useGetShopUrlFromShopAliasMock.mockReturnValueOnce(shopURL);
            Object.create(window);
            window.platformType = platform;
            window.shopAlias = shopAlias;
            window.returnUrl= returnUrl;

            const result = getReturnToCartTermAndLink();
            expect(result).toStrictEqual(expected);

        });

});
