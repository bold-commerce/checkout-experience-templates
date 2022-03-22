import {displayFatalError, getCheckoutUrl} from 'src/utils';

describe('Test getCheckoutUrl function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const dataSet = [
        {destination: '', platform: 'platform', shopAlias: 'shop', publicOrderId: 'abc123'},
        {destination: '/shipping_lines', platform: 'bigcommerce', shopAlias: 'store.bigcommerce.com', publicOrderId: 'abc123asdfasdfsdfa789af9afasdf89dfs'},
        {destination: '/payment', platform: 'shopify', shopAlias: 'store.shopify.com', publicOrderId: 'abc123asdfasdfsdfa789af9afasdf89dfd'},
        {destination: '/thank_you', platform: 'woocommerce', shopAlias: 'store.woo.com', publicOrderId: 'abc123asdfasdfsdfa789af9afasdf89dfw'},
        {destination: '/inventory_issues', platform: 'commercetools', shopAlias: 'store.commercetools.com', publicOrderId: 'abc123asdfasdfsdfa789af9afasdf89dfc'},
    ];

    test.each(dataSet)(
        'test getCheckoutUrl destination: $destination, platform: $platform  shopAlias: $shopAlias publicOrderId: $publicOrderId',
        ({destination, platform, shopAlias, publicOrderId}) => {
            Object.create(window);
            window.platformType = platform;
            window.shopAlias = shopAlias;
            window.publicOrderId = publicOrderId;

            const result = getCheckoutUrl(destination);
            expect(result).toStrictEqual(`/${platform}/${shopAlias}/experience${destination}?public_order_id=${publicOrderId}`);
        });
});
