export function useGetShopUrlFromShopAlias(shopAlias: string): string {
    let shopURL = shopAlias;
    if (shopURL.substr(0, 7) === 'http://') {
        shopURL = shopURL.replace('http://', 'https://');
    } else if (shopURL.substr(0, 8) !== 'https://') {
        shopURL = `https://${shopURL}`;
    }
    return shopURL;
}
