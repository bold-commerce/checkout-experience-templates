export function getCheckoutUrl(destination: string): string{
    const platform = window.platformType;
    const store = window.shopAlias;
    const append = destination ? `/${destination}` : '';

    return `/${platform}/${store}/experience${append}`;
}
