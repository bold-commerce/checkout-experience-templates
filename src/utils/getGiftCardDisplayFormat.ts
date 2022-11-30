export function getGiftCardDisplayFormat(giftCardNumber: string): string {
    const parts: Array<string> = [];

    for (let i = 0; i < giftCardNumber.length; i += 4) {
        parts.push(giftCardNumber.substring(i, i + 4));
    }

    if (parts.length) {
        return parts.join('-');
    } else {
        return giftCardNumber;
    }
}
