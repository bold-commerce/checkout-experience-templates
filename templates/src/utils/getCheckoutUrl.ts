export function getCheckoutUrl(destination: string): string{
    const platform = window.platformType;
    const store = window.shopAlias;

    return `/${platform}/${store}/experience${destination}`;
}
