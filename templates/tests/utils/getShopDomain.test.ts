import { getShopDomain } from 'src/utils';

describe('Test getShopDomain function', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const shopAlias = 'test-shop.alias.com';
    const customDomain = 'test-shop.custom.com';

    const dataSet = [
        {
            name: 'test has customDomain and has shopAlias',
            shopAlias: shopAlias, 
            customDomain: customDomain,
            expected: {domain: customDomain}
        },
        {
            name: 'test has customDomain and no shopAlias',
            shopAlias: '', 
            customDomain: customDomain,
            expected: {domain: customDomain}
        },
        {
            name: 'test has no customDomain and has shopAlias',
            shopAlias: shopAlias,
            customDomain: '',
            expected: {domain: shopAlias}
        },
        {
            name: 'test has no customDomain and has no shopAlias',
            shopAlias: '',
            customDomain: '',
            expected: {domain: ''}
        },
    ];

    test.each(dataSet)(
        '$name',
        (data) => {
            Object.create(window);
            window.shopAlias = data.shopAlias;
            window.customDomain = data.customDomain
            const result = getShopDomain();
            expect(result).toStrictEqual(data.expected.domain);
        });
});
