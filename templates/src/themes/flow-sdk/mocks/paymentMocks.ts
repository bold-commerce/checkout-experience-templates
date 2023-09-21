import {IMetaPaymentOptions, IMetaPaymentClient, IMetaPaymentConfiguration, IMetaPaymentDetails} from 'src/themes/flow-sdk/types';
import {
    ICurrency,
} from '@boldcommerce/checkout-frontend-library';
import {ITotals} from 'src/types';

export const MetaPaymentOptionsMock: IMetaPaymentOptions = {
    allowOfferCodes: true,
    requestBillingAddress: true,
    requestPayerEmail: true,
    requestPayerPhone: false,
    requestShipping: true,
    billingAddressMode: 'FULL',
    fulfillmentType: 'SHIPPING',
};


export const MetaPaymentClientMock: IMetaPaymentClient = {
    getAvailability: Object.assign(jest.fn(), {message: 'Some Message'}),
    renderButton: Object.assign(jest.fn(), {message: 'Some Message'}),
    getPaymentResponse: Object.assign(jest.fn(), {message: 'Some Message'}),
    attemptProactivePayment: Object.assign(jest.fn(), {message: 'Some Message'}),
    onPaymentDetailsChanged: Object.assign(jest.fn(), {message: 'Some Message'}),
    onPaymentConsent: Object.assign(jest.fn(), {message: 'Some Message'})
};


export const MetaPaymentConfiguration: IMetaPaymentConfiguration = {
    acquirerCountryCode: 'US',
    containerContext: 'publicOrderId',
    requestId: 'publicOrderId',
    mode: 'TEST',
    partnerId: 'partnerId',
    partnerMerchantId: 'partnerMerchantId',
    supportedContainers: {
        'basic-card-v1': {requireCVV: true},
        'ecom-token-v1': {},
    },
    uxFlags: ['META_CHECKOUT'],
};


export const MetaPaymentDetailsMock: IMetaPaymentDetails = {
    billingAddress: {
        addressLine: [
            '100 Main Street',
            'Unit 123',
        ],
        city: 'Winnipeg',
        country: 'CA',
        organization: 'Bold Commerce',
        phone: '',
        postalCode: 'R3Z 4S2',
        recipient: 'Jane Doe',
        region: 'MB',
    },
    displayItems: [
        {
            amount: {
                currency: 'CAD',
                value: '200.00',
            },
            imageURI: 'https://cdn11.bigcommerce.com/s-hk1wztnmcg/products/103/images/334/naturalcanvascart2.1624043582.220.290.jpg?c=1',
            label: '[Sample] Canvas Laundry Cart',
            quantity: 1,
        },
    ],
    fulfillmentOptionId: 'shipping_id_1',
    fulfillmentOptions: [
        {
            amount: {
                currency: 'CAD',
                value: '0.20',
            },
            id: 'shipping_id_1',
            label: 'USPS ground carrier',
        },
    ],
    offers: [
        {
            code: 'Test Discount Code',
            label: 'Test Text',
        }
    ],
    shippingAddress: {
        addressLine: [
            '50 Fultz Boulevard',
            '',
        ],
        city: 'Winnipeg',
        country: 'CA',
        organization: 'Bold Commerce',
        phone: '',
        postalCode: 'R3Y 0L6',
        recipient: 'John Doe',
        region: 'MB',
    },
    summaryItems: [
        {
            amount: {
                currency: 'CAD',
                value: '29.99',
            },
            label: 'Subtotal',
            summaryItemType: 'SUBTOTAL',
        },
        {
            amount: {
                currency: 'CAD',
                value: '0.10',
            },
            label: 'Fees',
            summaryItemType: 'FEE',
        },
        {
            amount: {
                currency: 'CAD',
                value: '0.10',
            },
            label: 'Taxes',
            summaryItemType: 'ESTIMATED_TAX',
        },
        {
            amount: {
                currency: 'CAD',
                value: '-0.10',
            },
            label: 'Discounts',
            summaryItemType: 'OFFER',
        },
        {
            amount: {
                currency: 'CAD',
                value: '0.20',
            },
            label: 'Shipping',
            summaryItemType: 'FULFILLMENT',
        },
    ],
    total: {
        amount: {
            currency: 'CAD',
            value: '29.99',
        },
        label: 'Total',
    },
};


export const CurrencyMock: ICurrency = {
    iso_code: 'CAD',
    iso_numeric_code: 124,
    symbol: '$',
    format: '${{amount}}',
    has_decimal: true,
    show_iso_code: true
};

export const TotalMock: ITotals = { 
    totalSubtotal: 2999, 
    totalFees: 10, 
    totalTaxes: 10, 
    totalAdditionalFees: 0, 
    totalOrder: 0, 
    totalPaid: 0, 
    totalDiscounts: 10, 
    totalAmountDue: 2999,
};