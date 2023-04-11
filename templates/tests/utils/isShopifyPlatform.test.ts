import {isShopifyPlatform} from 'src/utils';

describe('testing isShopifyPlatform', () => {

    const dataArray = [
        {
            name: 'test platform is Shopify ',
            data: 'shopify',
            expected: true
        },
        {
            name: 'test platform is bold_platform ',
            data: 'bold_platform',
            expected: false
        },
    ];


    test.each(dataArray)( '$name', ({data, expected}) => {
        window.platformType = data;
        const result = isShopifyPlatform();
        expect(result).toBe(expected);
    });
});
