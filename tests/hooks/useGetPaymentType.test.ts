import {getTerm, getCardDisplayFormat, getGiftCardDisplayFormat} from 'src/utils';
import {mocked} from 'jest-mock';
import {useGetPaymentType} from 'src/hooks';
import {IPayment} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';


jest.mock('src/utils/getTerm');
jest.mock('src/utils/getCardDisplayFormat');
jest.mock('src/utils/getGiftCardDisplayFormat');
const getCardDisplayFormatMock = mocked(getCardDisplayFormat, true);
const getGiftCardDisplayFormatMock = mocked(getGiftCardDisplayFormat, true);
const getTermMock = mocked(getTerm, true);

describe('Testing function getPaymentType', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const appStatePayment: IPayment = {
        gateway_public_id: '',
        amount: 0,
        currency: '',
        tag: '',
        type: '',
        display_string: '',
        id: '',
        token: '',
        retain: false,
        value: 0,
        brand: '',
        driver: '',
    };
    const expectedDisplay = '';

    const dataBrandedCreditCards = [
        {
            payment: {...appStatePayment, 'brand': 'Branded card', 'driver': 'Flexiti', 'lineText': '1111', 'tag': 'Credit'},
            getCardDisplayFormatResult: '•••• •••• •••• 1111',
            expected: '1111',
        },
        {
            payment: {...appStatePayment, 'brand': 'Branded card', 'driver': 'Branded_card', 'lineText': '1112', 'tag': 'Credit'},
            getCardDisplayFormatResult: '•••• •••• •••• 1112',
            expected: '1112',
        },
        {
            payment: {...appStatePayment, 'brand': 'Visa', 'driver': 'stripe', 'lineText': '4242', 'tag': 'Credit'},
            getCardDisplayFormatResult: '•••• •••• •••• 4242',
            expected: '4242',
        },
        {
            payment: {...appStatePayment, 'brand': undefined, 'driver': 'stripe', 'lineText': '4444', 'tag': 'Credit'},
            getCardDisplayFormatResult: '',
            expected: '4444',
        },
    ];

    const dataAmazonPaypalVenmoPluginsPay = [
        {
            payment: {...appStatePayment, 'brand': 'Amazon Pay', 'driver': 'Amazon', 'lineText': 'Amazon Pay', 'tag': 'Amazon'},
            useGetTerm: 'Amazon',
            expected: 'Amazon: Amazon Pay',
        },
        {
            payment: {...appStatePayment, 'brand': 'Amazon Pay', 'driver': 'Amazon Pay', 'lineText': 'Amazon Pay', 'tag': 'Amazon'},
            useGetTerm: 'Amazon',
            expected: 'Amazon: Amazon Pay',
        },
        {
            payment: {...appStatePayment, 'brand': 'PayPal', 'driver': 'paypal', 'lineText': 'PayPal', 'tag': 'PayPal'},
            useGetTerm: 'PayPal',
            expected: 'PayPal: PayPal',
        },
        {
            payment: {...appStatePayment, 'brand': 'PayPal', 'driver': 'paypal_paypal', 'lineText': 'PayPal', 'tag': 'PayPal'},
            useGetTerm: 'PayPal',
            expected: 'PayPal: PayPal',
        },
        {
            payment: {...appStatePayment, 'brand': 'PayPal', 'driver': 'paypal_braintree', 'lineText': 'PayPal', 'tag': 'PayPal'},
            useGetTerm: 'PayPal',
            expected: 'PayPal: PayPal',
        },
        {
            payment: {...appStatePayment, 'brand': 'Venmo', 'driver': 'venmo', 'lineText': 'Venmo by Braintree', 'tag': 'Venmo'},
            useGetTerm: 'Venmo By Braintree',
            expected: 'Venmo By Braintree: Venmo by Braintree',
        },
        {
            payment: {...appStatePayment, 'brand': 'Venmo', 'driver': 'venmo_braintree', 'lineText': 'Venmo by Braintree', 'tag': 'Venmo'},
            useGetTerm: 'Venmo By Braintree',
            expected: 'Venmo By Braintree: Venmo by Braintree',
        },
        {
            payment: {...appStatePayment, 'brand': 'Plugins v2', 'driver': 'plugin_v2', 'lineText': 'Plugins v2', 'tag': 'Plugins'},
            useGetTerm: 'Payment by Plugins v2',
            expected: 'Payment by Plugins v2: Plugins v2',
        },
        {
            payment: {...appStatePayment, 'brand': '', 'driver': 'paypal_paypal_commerce_platform', 'lineText': 'lineText', 'tag': 'PayPal'},
            useGetTerm: 'PayPal',
            expected: 'lineText',
        },
    ];

    test('rendering the hook properly when driver and type given', () => {
        const result = useGetPaymentType({...appStatePayment, type: 'test', driver: 'test'});

        expect(result).toStrictEqual(expectedDisplay);
    });

    test('rendering the hook properly when lineText undefined', () => {
        getCardDisplayFormatMock.mockReturnValueOnce('');
        const result = useGetPaymentType({...appStatePayment, brand: 'Visa', tag: 'Credit', driver: 'stripe'});

        expect(result).toStrictEqual(appStatePayment.display_string);
    });

    test('rendering the hook properly - Payment by Gift Card', () => {
        getTermMock.mockReturnValueOnce('Gift card');
        getGiftCardDisplayFormatMock.mockReturnValueOnce('ABCD-1234-EFGH-5678');
        const result = useGetPaymentType({
            ...appStatePayment,
            tag: 'BoldGiftCard',
            driver: 'gift_card',
            lineText: 'ABCD1234EFGH5678',
            brand: 'Giftcard'
        });

        expect(result).toStrictEqual('Gift card: ABCD-1234-EFGH-5678');
    });

    test.each(dataAmazonPaypalVenmoPluginsPay)('rendering the hook properly - Amazon Pay, Venmo, PayPal, Plugins', ({payment, useGetTerm, expected}) => {
        getTermMock.mockReturnValueOnce(useGetTerm);
        const result = useGetPaymentType(payment);

        expect(result).toStrictEqual(expected);
    });

    test.each(dataBrandedCreditCards)('rendering the hook properly when Credit and Branded Cards', ({payment, getCardDisplayFormatResult, expected}) => {
        getCardDisplayFormatMock.mockReturnValueOnce(getCardDisplayFormatResult);
        const result = useGetPaymentType(payment);

        expect(result).toStrictEqual(expected);
    });
});
