import {CreditBrandedCardsBrand} from 'src/constants';

export function getCardDisplayFormat(brand: string, lineText: string): string {
    if (lineText === '') {
        return brand;
    }

    const amexCards = CreditBrandedCardsBrand.AMEX_CARDS;
    const otherCards = CreditBrandedCardsBrand.OTHER_CARDS;

    const lowerCaseBrand = brand.toLowerCase();
    if (amexCards.includes(lowerCaseBrand)) {
        return `•••• •••••• ${lineText}`;
    } else if (otherCards.includes(lowerCaseBrand)) {
        return `•••• •••• •••• ${lineText}`;
    } else {
        return lineText;
    }
}
