import {useGetShopUrlFromShopAlias} from 'src/hooks';
import {isBoldPlatform} from 'src/utils';

export function getReturnToCartTermAndLink(): {term: string, link: string} {
    const shopAlias = window.shopAlias;
    // TODO PXP-682
    if (shopAlias == 'lowlaundry.cpanel.boldlabs.net' || shopAlias == 'lowlaundry.com' || shopAlias == 'dev.lowlaundry.com' || shopAlias =='store-hk1wztnmcg.mybigcommerce.com') {
        const term = 'return_to_cart';
        const link = `https://${shopAlias}/checkout/cart`;
        return {term, link};
    } else {
        const shopURL = useGetShopUrlFromShopAlias(window.shopAlias);
        const isCustom = isBoldPlatform();
        const term = isCustom ? 'return_to_store' : 'return_to_cart';
        const link = isCustom ? shopURL : window.returnUrl;
        return {term, link};
    }
}
