import {mocked} from 'jest-mock';
import {updateOnShippingContactSelected} from 'src/eps';
import {
    baseReturnObject,
    estimateShippingLines,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setTaxes,
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

    beforeEach(() => {
        jest.resetAllMocks();
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
        getShippingMock.mockReturnValue(initialDataMock.application_state.shipping);
    });

    test('testing update shipping contact with rsa enabled', async () => {

        estimateShippingLinesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        estimateTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

        await updateOnShippingContactSelected(initialDataMock.application_state.addresses.shipping);

        expect(estimateShippingLinesMock).toHaveBeenCalledTimes(1);
        expect(getShippingMock).toHaveBeenCalledTimes(1);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
    });

    test('testing update shipping contact with rsa not enabled', async () => {

        getOrderInitialDataMock.mockReturnValue({...initialDataMock.initial_data,
            general_settings: {...initialDataMock.initial_data.general_settings,
                checkout_process: {...initialDataMock.initial_data.general_settings.checkout_process, rsa_enabled: false}}});
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        setTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

        await updateOnShippingContactSelected(initialDataMock.application_state.addresses.shipping);

        expect(callShippingAddressEndpointMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
    });
});