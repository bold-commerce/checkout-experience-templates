import {mocked} from 'jest-mock';
import {braintreePaypalUpdateOrder} from 'src/eps';
import {
    IBraintreePaypalOnUpdatePaymentDataPayload,
    IBraintreePaypalOnUpdatePaymentPayload,
} from 'src/types';
import {
    baseReturnObject,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping, getShippingLines,
    IShipping,
    IShippingLine, setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {callShippingAddressEndpoint} from 'src/utils';
import {initialDataMock} from 'src/mocks';

jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');

const estimateShippingLinesMock = mocked(estimateShippingLines, true);
const getShippingMock = mocked(getShipping, true);
const estimateTaxesMock = mocked(estimateTaxes, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);

describe('testing braintreePaypalUpdateOrder', () => {

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
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
        getShippingMock.mockReturnValue(fakeShipping);
    });

    test('testing update shipping address and shipping option with rsa enabled', async () => {

        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

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

        await braintreePaypalUpdateOrder(payload);

        expect(estimateShippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(2);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
    });

    test('testing update shipping address and shipping option with rsa not enabled', async () => {

        getOrderInitialDataMock.mockReturnValue({...initialDataMock.initial_data,
            general_settings: {...initialDataMock.initial_data.general_settings,
                checkout_process: {...initialDataMock.initial_data.general_settings.checkout_process, rsa_enabled: false}}});
        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));

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

        await braintreePaypalUpdateOrder(payload);

        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(2);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
    });
});