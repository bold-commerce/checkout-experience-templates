import {PlatformTypeConstants} from 'src/constants';

export function isShopifyPlatform(): boolean {
    return window.platformType === PlatformTypeConstants.SHOPIFY;
}
