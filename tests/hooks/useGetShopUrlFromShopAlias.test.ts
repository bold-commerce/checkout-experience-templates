import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    overlay: 'test'
};

const expected = 'https://shop-alias.test.com';
const shopAlias = [
    {alias: 'shop-alias.test.com'},
    {alias: 'http://shop-alias.test.com'},
    {alias: 'https://shop-alias.test.com'},
];

describe('Testing useGetLineItems', () => {
    test.each(shopAlias)('test hook properly', ({alias}) => {
        const {result} = renderHook(() => useGetShopUrlFromShopAlias(alias));
        expect(result.current).toStrictEqual(expected);
    });
});
