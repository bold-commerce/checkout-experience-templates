import {mocked} from 'jest-mock';
import {
    baseReturnObject,
    IWalletPayCreateOrderRequest, IWalletPayCreateOrderResponse,
    walletPayCreateOrder,
} from '@boldcommerce/checkout-frontend-library';
import {hydrateOrder, onCreatePaymentOrder} from 'src/eps';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {formatApplePayContactToCheckoutAddress, formatShippingAddressGoogle} from 'src/utils';
import {initialDataMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/walletPay/walletPayCreateOrder');
jest.mock('src/utils/formatShippingAddressGoogle');
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('src/eps/hydrateOrder');

const walletPayCreateOrderMock = mocked(walletPayCreateOrder, true);
const formatShippingAddressGoogleMock = mocked(formatShippingAddressGoogle, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);
const hydrateOrderMock = mocked(hydrateOrder, true);
describe('testing onCreatePaymentOrder', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('testing with ppcp type successful', async () => {
        const response: IWalletPayCreateOrderResponse = {
            payment_data: {
                id: 'test-order'
            },
            application_state: applicationStateMock
        };
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        paymentReturn.response = {data: response};
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));

        const payload: IWalletPayCreateOrderRequest = {
            gateway_type: 'paypal',
            payment_data: {
                payment_type: 'paypal',
                locale: 'en',
            }
        };
        const result = await onCreatePaymentOrder('ppcp', payload);

        expect(walletPayCreateOrderMock).toHaveBeenCalledTimes(1);
        expect(walletPayCreateOrderMock).toHaveBeenCalledWith(payload);

        expect(result).toStrictEqual({payment_data: {id: 'test-order'}});
    });

    test('testing with ppcp type with error', async () => {
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = false;
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));

        const payload: IWalletPayCreateOrderRequest = {
            gateway_type: 'paypal',
            payment_data: {
                payment_type: 'paypal',
                locale: 'en',
            }
        };
        await onCreatePaymentOrder('ppcp', payload).catch( e => {
            expect(e).toStrictEqual(new Error('Unable to create order'));
        });
    });

    test('testing with ppcp type with google', async () => {
        const response: IWalletPayCreateOrderResponse = {
            payment_data: {
                id: 'test-order'
            },
            application_state: applicationStateMock
        };
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        paymentReturn.response = {data: response};
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));
        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        formatShippingAddressGoogleMock.mockReturnValue(shippingAddress);

        const payload: IWalletPayCreateOrderRequest = {
            gateway_type: 'paypal',
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
        const result = await onCreatePaymentOrder('ppcp', payload);

        expect(formatShippingAddressGoogleMock).toHaveBeenCalledTimes(2);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(walletPayCreateOrderMock).toHaveBeenCalledTimes(1);
        expect(walletPayCreateOrderMock).toHaveBeenCalledWith(payload);
        expect(result).toStrictEqual({payment_data: {id: 'test-order'}});
    });

    test('testing with ppcp type with apple', async () => {
        const response: IWalletPayCreateOrderResponse = {
            payment_data: {
                id: 'test-order'
            },
            application_state: applicationStateMock
        };
        const paymentReturn = {...baseReturnObject};
        paymentReturn.success = true;
        paymentReturn.response = {data: response};
        walletPayCreateOrderMock.mockReturnValue(Promise.resolve(paymentReturn));
        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        formatApplePayContactToCheckoutAddressMock.mockReturnValue(shippingAddress);

        const payload: IWalletPayCreateOrderRequest = {
            gateway_type: 'paypal',
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
        const result = await onCreatePaymentOrder('ppcp', payload);

        expect(formatApplePayContactToCheckoutAddressMock).toHaveBeenCalledTimes(2);
        expect(hydrateOrderMock).toHaveBeenCalledTimes(1);
        expect(walletPayCreateOrderMock).toHaveBeenCalledTimes(1);
        expect(walletPayCreateOrderMock).toHaveBeenCalledWith(payload);
        expect(result).toStrictEqual({payment_data: {id: 'test-order'}});
    });
});
