import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    walletPayOnApprove
} from '@boldcommerce/checkout-frontend-library';
import {hydrateOrder, onApprovePaymentOrder} from 'src/eps';
import {displayOrderProcessingScreen, processOrder} from 'src/library';
import {actionAddError} from 'src/action';
import {
    IApplePayOnApprovePayload,
    IBraintreePaypalOnApprovePayload,
    IGooglePayOnApprovePayload,
    IOnApproveStripePayload,
} from 'src/types';
import {
    formatApplePayContactToCheckoutAddress,
    formatBraintreePaypalAddress,
    formatShippingAddressGoogle, formatStripeShippingAddress
} from 'src/utils';
import {initialDataMock} from 'src/mocks';
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('src/eps/hydrateOrder');
jest.mock('src/utils/formatShippingAddressGoogle');
jest.mock('src/utils/formatBraintreePaypalAddress');
jest.mock('src/utils/formatStripeShippingAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayOnApprove');
jest.mock('src/library/displayOrderProcessingScreen');
jest.mock('src/library/processOrder');
jest.mock('src/action/appAction');

const walletPayOnApproveMock = mocked(walletPayOnApprove, true);
const displayOrderProcessingScreenMock = mocked(displayOrderProcessingScreen, true);
const processOrderMock = mocked(processOrder, true);
const actionAddErrorMock = mocked(actionAddError, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);
const hydrateOrderMock = mocked(hydrateOrder, true);
const formatShippingAddressGoogleMock = mocked(formatShippingAddressGoogle, true);
const formatBraintreePaypalAddressMock = mocked(formatBraintreePaypalAddress, true);
const formatStripeShippingAddressMock = mocked(formatStripeShippingAddress, true);

describe('testing onApprovePaymentOrder', () => {

    const dispatchMock = jest.fn();
    const historyMock = jest.fn();
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('testing with ppcp type', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        walletPayOnApproveMock.mockReturnValue(Promise.resolve(paymentReturn));
        const payload = {data: '123'};
        await onApprovePaymentOrder(dispatchMock, historyMock,'ppcp',{payment_id: '234'}, payload);

        expect(walletPayOnApproveMock).toHaveBeenCalledTimes(1);
        expect(walletPayOnApproveMock).toHaveBeenCalledWith(payload);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('testing with ppcp type with errors', async () => {
        const paymentReturn = {...baseReturnObject};
        walletPayOnApproveMock.mockReturnValue(Promise.resolve(paymentReturn));
        const payload = {data: '123'};
        await onApprovePaymentOrder(dispatchMock, historyMock,'ppcp',{payment_id: '234'}, payload);

        expect(walletPayOnApproveMock).toHaveBeenCalledTimes(1);
        expect(walletPayOnApproveMock).toHaveBeenCalledWith(payload);
        expect(dispatchMock).not.toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(1);
    });

    test('testing with ppcp and apple pay', async () => {
        const payload: IApplePayOnApprovePayload = {
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
                billing_address: {
                    emailAddress: 'test@test.com',
                    familyName: 'John',
                    givenName: 'Doe',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    administrativeArea: 'MB',

                },
            }
        };
        await onApprovePaymentOrder(dispatchMock, historyMock,'ppcp',{payment_id: '234'}, payload);

        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('testing with braintree and apple pay', async () => {
        const payload: IApplePayOnApprovePayload = {
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
                billing_address: {
                    emailAddress: 'test@test.com',
                    familyName: 'John',
                    givenName: 'Doe',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    administrativeArea: 'MB',

                },
            }
        };
        await onApprovePaymentOrder(dispatchMock, historyMock,'braintree',{payment_id: '234'}, payload);

        expect(formatApplePayContactToCheckoutAddressMock).toHaveBeenCalledTimes(2);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('testing with braintree and google pay', async () => {
        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        formatShippingAddressGoogleMock.mockReturnValue(shippingAddress);

        const payload: IGooglePayOnApprovePayload = {
            gateway_type: 'google',
            payment_data: {
                payment_type: 'google',
                locale: 'en',
                shipping_address: {
                    locality: 'Winnipeg',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    administrativeArea: 'MB',

                },
                billing_address: {
                    locality: 'Winnipeg',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    administrativeArea: 'MB',

                },
            }
        };

        await onApprovePaymentOrder(dispatchMock, historyMock,'braintree',{payment_id: '234'}, payload);

        expect(formatShippingAddressGoogleMock).toHaveBeenCalledTimes(2);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('testing with braintree and paypal', async () => {
        const payload: IBraintreePaypalOnApprovePayload = {
            gateway_type: 'paypal',
            payment_data: {
                payment_type: 'paypal',
                locale: 'en',
                shipping_address: {
                    line1: '123 street',
                    city: 'Winnipeg',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    state: 'MB',

                },
                billing_address: {
                    line1: '123 street',
                    city: 'Winnipeg',
                    postalCode: 'R3B 3N4',
                    countryCode: 'CA',
                    state: 'MB',

                },
                is_wallet_pay: true,
                customer: {
                    first_name: 'John',
                    last_name: 'Doe',
                    email_address: 'test@test.com',
                }
            }
        };

        await onApprovePaymentOrder(dispatchMock, historyMock,'braintree',{payment_id: '234'}, payload);

        expect(formatBraintreePaypalAddressMock).toHaveBeenCalledTimes(2);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });

    test('testing with stripe', async () => {
        const payload: IOnApproveStripePayload = {
            gateway_type: 'stripe',
            payment_data: {
                shipping_address: {
                    city: 'Winnipeg',
                    country: 'CA',
                    phone: '11111111111',
                    postalCode: '',
                    recipient: 'John Doe',
                    region: '',
                },
                card: {
                    address_city: 'Winnipeg',
                    address_country: 'CA',
                    address_line1: '123 street',
                    address_line1_check: 'test',
                    address_line2: '',
                    address_state: '',
                    address_zip: '',
                    address_zip_check: '',
                    brand: '',
                    country: 'CA',
                    dynamic_last4: '1234',
                    exp_month: 11,
                    exp_year: 2077,
                    funding: 'test',
                    id: '1',
                    last4: '1234',
                    name: 'some name',
                    object: '',
                    tokenization_method: '',
                    currency: 'CAD',
                    cvc_check: 'test',
                },
                customer: {
                    payerEmail: 'test@test.com',
                    payerName: 'John Doe',
                    payerPhone: '11111111111',
                }
            }
        };

        await onApprovePaymentOrder(dispatchMock, historyMock,'stripe',{payment_id: '234'}, payload);

        expect(formatStripeShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreenMock);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });
});
