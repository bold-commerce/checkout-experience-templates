import {getCheckoutUrl} from 'src/utils';

describe('Test getCheckoutUrl function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const dataSet = [
        {destination: 'shipping_lines', platform: 'bigcommerce', shopAlias: 'store.bigcommerce.com'},
        {destination: 'payment', platform: 'shopify', shopAlias: 'store.shopify.com'},
        {destination: 'thank_you', platform: 'woocommerce', shopAlias: 'store.woo.com'},
        {destination: 'inventory_issues', platform: 'commercetools', shopAlias: 'store.commercetools.com'},
    ];

    test.each(dataSet)(
        'test getCheckoutUrl destination: $destination, platform: $platform  shopAlias: $shopAlias publicOrderId: $publicOrderId',
        ({destination, platform, shopAlias}) => {
            Object.create(window);
            window.platformType = platform;
            window.shopAlias = shopAlias;

            const result = getCheckoutUrl(destination);
            expect(result).toStrictEqual(`/${platform}/${shopAlias}/experience/${destination}`);
        });
});
