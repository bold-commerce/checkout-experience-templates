import {isObjectEmpty} from 'src/utils';

export function getShopDomain(): string {
    const shopDomain = !isObjectEmpty(window.customDomain) ?
        window.customDomain : !isObjectEmpty(window.shopAlias) ?
            window.shopAlias : '';
    return shopDomain;
}
