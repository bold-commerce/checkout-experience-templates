export class CreditBrandedCardsBrand {
    static AMEX_CARDS = [
        'american express',
        'american_express',
        'american-express',
        'americanexpress',
        'amex',
        'apple pay - american express',
    ];
    static VISA_CARDS = [
        'apple pay - visa',
        'visa',
        'visa debit',
        'visaprepaidanonymous',
    ];
    static MASTERCARD_CARDS = [
        'master',
        'mastercard',
    ];
    static OTHER_CARDS = [
        'dankort',
        'diners',
        'diners club',
        'dinersclub',
        'discover',
        'elo',
        'flexiti business',
        'flexiti personal',
        'jcb',
        'kieranpay',
        'maestro',
        'mcprepaidanonymous',
        'moneris',
        'unionpay',
    ];
    static ALL_CARDS = CreditBrandedCardsBrand.OTHER_CARDS.concat(CreditBrandedCardsBrand.AMEX_CARDS, CreditBrandedCardsBrand.VISA_CARDS, CreditBrandedCardsBrand.MASTERCARD_CARDS);
}
