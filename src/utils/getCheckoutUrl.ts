export function getCheckoutUrl(destination: string): string{
    const platform = window.platformType;
    const store = window.shopAlias;
    const publicOrderId = window.publicOrderId;

    return `/${platform}/${store}/experience${destination}?public_order_id=${publicOrderId}`;
}
