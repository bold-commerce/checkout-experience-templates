import {isBoldPlatform} from 'src/utils';

describe('testing isBoldPlatform', () => {

    const dataArray = [
        {
            name: 'test platform is Shopify ',
            data: 'shopify',
            expected: false
        },
        {
            name: 'test platform is bold_platform ',
            data: 'bold_platform',
            expected: true
        },
    ];


    test.each(dataArray)( '$name', ({data, expected}) => {
        window.platformType = data;
        const result = isBoldPlatform();
        expect(result).toBe(expected);
    });
});
