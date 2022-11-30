import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {isBoldPlatform} from 'src/utils';

export function getReturnToCartTermAndLink(): {term: string, link: string} {
    const shopURL = useGetShopUrlFromShopAlias(window.shopAlias);
    const isCustom = isBoldPlatform();
    const term = isCustom ? 'return_to_store': 'return_to_cart';
    const link = isCustom ? shopURL : window.returnUrl;
    return {term, link};
}
