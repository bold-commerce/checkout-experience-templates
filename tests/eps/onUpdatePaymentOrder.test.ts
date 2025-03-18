import {mocked} from 'jest-mock';
import {
    baseReturnObject, getShipping, IShipping, IShippingLine,
    IWalletPayOnShippingRequest,
    walletPayOnShipping
} from '@boldcommerce/checkout-frontend-library';
import {
    braintreeAppleUpdateOrder, braintreeGoogleUpdateOrder,
    braintreePaypalUpdateOrder, onRequireOrderData,
    onUpdatePaymentOrder, stripeUpdateOrder,
    updateOnShippingContactSelected,
    updateOnShippingMethodSelected
} from 'src/eps';
import {
    IApplePayOnUpdatePayload,
    IApplePayOnUpdatePaymentDataPayload,
    IBraintreePaypalOnUpdatePaymentDataPayload,
    IBraintreePaypalOnUpdatePaymentPayload,
    IGooglePayOnUpdatePayload,
    IGooglePayOnUpdatePaymentDataPayload, IOnUpdateStripePayload
} from 'src/types';
import {formatApplePayContactToCheckoutAddress} from 'src/utils';


jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayOnShipping');
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('src/eps/updateOnShippingContactSelected');
jest.mock('src/eps/updateOnShippingMethodSelected');
jest.mock('src/eps/braintreeGoogleUpdateOrder');
jest.mock('src/eps/braintreeAppleUpdateOrder');
jest.mock('src/eps/braintreePaypalUpdateOrder');
jest.mock('src/eps/stripeUpdateOrder');
jest.mock('src/eps/onRequireOrderData');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');

const walletPayOnShippingMock = mocked(walletPayOnShipping, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);
const updateOnShippingContactSelectedMock = mocked(updateOnShippingContactSelected, true);
const updateOnShippingMethodSelectedMock = mocked(updateOnShippingMethodSelected, true);
const braintreeGoogleUpdateOrderMock = mocked(braintreeGoogleUpdateOrder, true);
const braintreeAppleUpdateOrderMock = mocked(braintreeAppleUpdateOrder, true);
const braintreePaypalUpdateOrderMock = mocked(braintreePaypalUpdateOrder, true);
const stripeUpdateOrderMock = mocked(stripeUpdateOrder, true);
const onRequireOrderDataMock = mocked(onRequireOrderData, true);
const getShippingMock = mocked(getShipping, true);

describe('testing onApprovePaymentOrder', () => {

    const fakeShippingLine1: IShippingLine = {
        id: '0',
        description: 'fakeDescription1',
        amount: 100,
        code: '',
    };

    const fakeShippingLine2: IShippingLine = {
        id: '1',
        description: 'fakeDescription2',
        amount: 100,
        code: '',
    };

    const fakeShipping: IShipping = {
        selected_shipping: fakeShippingLine1,
        available_shipping_lines: [fakeShippingLine1, fakeShippingLine2],
        taxes: [],
        discounts: []
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getShippingMock.mockReturnValue(fakeShipping);
    });

    test('testing with ppcp type', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        walletPayOnShippingMock.mockReturnValue(Promise.resolve(paymentReturn));
        const payload: IWalletPayOnShippingRequest = {
            gateway_type: 'paypal',
            payment_data: {
                paypal_order_id: '123',
                locale: 'en',
                payment_action_type: 'update'
            }
        };
        const response = await onUpdatePaymentOrder('ppcp', payload);

        expect(walletPayOnShippingMock).toHaveBeenCalledTimes(1);
        expect(walletPayOnShippingMock).toHaveBeenCalledWith(payload);
        expect(response).toStrictEqual({success: true});
    });

    test('testing with ppcp type with apple pay', async () => {
        const payload: IApplePayOnUpdatePayload = {
            gateway_type: 'apple',
            payment_data: {
                payment_type: 'apple',
                locale: 'en',
                shipping_address: {
                    emailAddress: 'test@test.com',
                    familyName: 'John',
                    givenName: 'Doe',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    administrativeArea: 'MB',

                },
                shipping_options: {
                    label: 'Flat Rate',
                    detail: 'Flat Rate Shipping',
                    amount: '12.33',
                    identifier: '1'
                },
            },
            require_order_data: ['totals'],
        };

        await onUpdatePaymentOrder('ppcp', payload);

        expect(formatApplePayContactToCheckoutAddressMock).toHaveBeenCalledTimes(1);
        expect(updateOnShippingContactSelectedMock).toHaveBeenCalledTimes(1);
        expect(updateOnShippingMethodSelectedMock).toHaveBeenCalledTimes(1);
        expect(onRequireOrderDataMock).toHaveBeenCalledTimes(1);
    });

    test('testing with braintree google pay', async () => {
        const paymentData: IGooglePayOnUpdatePaymentDataPayload = {
            payment_type: 'google',
            locale: 'en_US',
            order_id: '1234',
            shipping_address: {
                locality: 'Winnipeg',
                postalCode: 'R3B 3N4',
                countryCode: 'CA',
                administrativeArea: 'MB',

            },
            shipping_options: {
                label: 'Flat Rate',
                description: 'Flat Rate Shipping',
                id: '1'
            },
        };

        const payload: IGooglePayOnUpdatePayload = {
            gateway_type: 'braintree',
            gateway_id: 1,
            require_order_data: ['totals'],
            payment_data: paymentData
        };

        await onUpdatePaymentOrder('braintree', payload);

        expect(braintreeGoogleUpdateOrderMock).toHaveBeenCalledTimes(1);
        expect(onRequireOrderDataMock).toHaveBeenCalledTimes(1);
    });

    test('testing with braintree apple pay', async () => {
        const paymentData: IApplePayOnUpdatePaymentDataPayload = {
            payment_type: 'apple',
            locale: 'en_US',
            order_id: '1234',
            shipping_address: {
                emailAddress: 'test@test.com',
                familyName: 'John',
                givenName: 'Doe',
                postalCode: 'R3B 3N4',
                countryCode: 'CA',
                administrativeArea: 'MB',

            },
            shipping_options: {
                label: 'Flat Rate',
                detail: 'Flat Rate Shipping',
                amount: '12.3',
                identifier: '1'
            },
        };

        const payload: IApplePayOnUpdatePayload = {
            gateway_type: 'braintree',
            gateway_id: 1,
            require_order_data: ['totals'],
            payment_data: paymentData
        };

        await onUpdatePaymentOrder('braintree', payload);

        expect(braintreeAppleUpdateOrderMock).toHaveBeenCalledTimes(1);
        expect(onRequireOrderDataMock).toHaveBeenCalledTimes(1);
    });

    test('testing with braintree paypal', async () => {
        const paymentData: IBraintreePaypalOnUpdatePaymentDataPayload = {
            payment_type: 'paypal',
            locale: 'en_US',
            shipping_address: {
                city: 'Winnipeg',
                postal_code: 'R3B 3N4',
                country_code: 'CA',
                state: 'MB',

            },
            shipping_options: {
                label: 'Flat Rate',
                type: 'SHIPPING',
                amount: {
                    currency_code: 'CAD',
                    value: '23.22',
                }
            },
        };

        const payload: IBraintreePaypalOnUpdatePaymentPayload = {
            gateway_type: 'braintree',
            gateway_id: 1,
            require_order_data: ['totals'],
            payment_data: paymentData
        };

        await onUpdatePaymentOrder('braintree', payload);

        expect(braintreePaypalUpdateOrderMock).toHaveBeenCalledTimes(1);
        expect(onRequireOrderDataMock).toHaveBeenCalledTimes(1);
    });

    test('testing with stripe update', async () => {
        const paymentData = {
            payment_type: 'paypal',
            locale: 'en_US',
            shipping_address: {
                city: 'Winnipeg',
                country: 'CA',
                postalCode: 'R3B 3N4',
                region: 'MB',
                recipient: 'John Doe',

            },
            shipping_options: {
                label: 'Flat Rate',
                id: '1',
                description: 'Flat Rate Shipping'
            },
        };

        const payload: IOnUpdateStripePayload = {
            gateway_type: 'stripe',
            gateway_id: 1,
            require_order_data: ['totals'],
            payment_data: paymentData
        };

        await onUpdatePaymentOrder('stripe', payload);

        expect(stripeUpdateOrderMock).toHaveBeenCalledTimes(1);
        expect(onRequireOrderDataMock).toHaveBeenCalledTimes(1);
    });

});
