import {mocked} from 'jest-mock';
import {stripeUpdateOrder} from 'src/eps';
import {IOnUpdateStripePayload,} from 'src/types';
import {
    baseReturnObject,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping, getShippingLines,
    IShipping,
    IShippingLine,
    setTaxes,
    setShippingAddress, changeShippingLine
} from '@boldcommerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address');

const estimateShippingLinesMock = mocked(estimateShippingLines, true);
const getShippingMock = mocked(getShipping, true);
const estimateTaxesMock = mocked(estimateTaxes, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const setShippingAddressMock = mocked(setShippingAddress, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

describe('testing stripeUpdateOrder', () => {

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
        changeShippingLineMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
    });

    test('testing update shipping address and shipping option with rsa enabled', async () => {

        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        estimateTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

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

        await stripeUpdateOrder(payload);

        expect(estimateShippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
    });

    test('testing update shipping address and shipping option with rsa not enabled', async () => {

        getOrderInitialDataMock.mockReturnValue({...initialDataMock.initial_data,
            general_settings: {...initialDataMock.initial_data.general_settings,
                checkout_process: {...initialDataMock.initial_data.general_settings.checkout_process, rsa_enabled: false}}});
        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        setShippingAddressMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        setTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

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

        await stripeUpdateOrder(payload);

        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
    });
});