import {mocked} from 'jest-mock';
import {braintreeAppleUpdateOrder, updateOnShippingContactSelected, updateOnShippingMethodSelected} from 'src/eps';
import {IApplePayOnUpdatePayload, IApplePayOnUpdatePaymentDataPayload} from 'src/types';
import {getShipping, IShipping, IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {formatApplePayContactToCheckoutAddress} from 'src/utils';
import {initialDataMock} from 'src/mocks';

jest.mock('src/eps/updateOnShippingContactSelected');
jest.mock('src/eps/updateOnShippingMethodSelected');
jest.mock('src/utils/formatApplePayContactToCheckoutAddress');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');

const updateOnShippingContactSelectedMock = mocked(updateOnShippingContactSelected, true);
const updateOnShippingMethodSelectedMock = mocked(updateOnShippingMethodSelected, true);
const getShippingMock = mocked(getShipping, true);
const formatApplePayContactToCheckoutAddressMock = mocked(formatApplePayContactToCheckoutAddress, true);

describe('testing braintreeAppleUpdateOrder', () => {

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
    });

    test('testing update shipping address and shipping option', async () => {

        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        getShippingMock.mockReturnValueOnce(fakeShipping);
        formatApplePayContactToCheckoutAddressMock.mockReturnValue(shippingAddress);

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

        await braintreeAppleUpdateOrder(payload);

        expect(updateOnShippingContactSelectedMock).toHaveBeenCalledTimes(1);
        expect(updateOnShippingMethodSelectedMock).toHaveBeenCalledTimes(1);
    });
});