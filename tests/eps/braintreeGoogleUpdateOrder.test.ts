import {mocked} from 'jest-mock';
import {
    braintreeGoogleUpdateOrder,
} from 'src/eps';
import {
    IGooglePayOnUpdatePayload,
    IGooglePayOnUpdatePaymentDataPayload
} from 'src/types';
import {
    baseReturnObject,
    changeShippingLine,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping, getShippingLines,
    IShipping,
    IShippingLine, setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {formatShippingAddressGoogle, callShippingAddressEndpoint} from 'src/utils';
import {initialDataMock} from 'src/mocks';

jest.mock('src/utils/formatShippingAddressGoogle');
jest.mock('src/utils/callShippingAddressEndpoint');
jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');

const estimateShippingLinesMock = mocked(estimateShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);
const getShippingMock = mocked(getShipping, true);
const estimateTaxesMock = mocked(estimateTaxes, true);
const formatShippingAddressGoogleMock = mocked(formatShippingAddressGoogle, true);
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);

describe('testing braintreeGoogleUpdateOrder', () => {

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
    });

    test('testing update shipping address and shipping option with rsa enabled', async () => {

        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        getShippingMock.mockReturnValueOnce(fakeShipping);
        formatShippingAddressGoogleMock.mockReturnValue(shippingAddress);
        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

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

        await braintreeGoogleUpdateOrder(payload);

        expect(estimateShippingLinesMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
    });

    test('testing update shipping address and shipping option with rsa not enabled', async () => {

        const shippingAddress = {...initialDataMock.application_state.addresses.shipping, id: '1'};
        getOrderInitialDataMock.mockReturnValue({...initialDataMock.initial_data,
            general_settings: {...initialDataMock.initial_data.general_settings,
                checkout_process: {...initialDataMock.initial_data.general_settings.checkout_process, rsa_enabled: false}}});
        formatShippingAddressGoogleMock.mockReturnValue(shippingAddress);
        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        getShippingMock.mockReturnValueOnce(fakeShipping);

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

        await braintreeGoogleUpdateOrder(payload);

        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
    });
});