import {mocked} from 'jest-mock';
import {updateOnShippingMethodSelected} from 'src/eps';
import {
    baseReturnObject, changeShippingLine,
    estimateTaxes,
    getOrderInitialData,
    getShipping,
    getShippingLines,
    setTaxes,
} from '@boldcommerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');

const getShippingMock = mocked(getShipping, true);
const estimateTaxesMock = mocked(estimateTaxes, true);
const getOrderInitialDataMock = mocked(getOrderInitialData, true);
const setTaxesMock = mocked(setTaxes, true);
const getShippingLinesMock = mocked(getShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

describe('testing updateOnShippingMethodSelected', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
        getShippingMock.mockReturnValue(initialDataMock.application_state.shipping);
        changeShippingLineMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        getShippingLinesMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
    });

    test('testing update shipping method with rsa enabled', async () => {

        estimateTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

        await updateOnShippingMethodSelected(initialDataMock.application_state.shipping.selected_shipping);

        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(estimateTaxesMock).toHaveBeenCalledTimes(1);
    });

    test('testing update shipping method with rsa not enabled', async () => {

        getOrderInitialDataMock.mockReturnValue({...initialDataMock.initial_data,
            general_settings: {...initialDataMock.initial_data.general_settings,
                checkout_process: {...initialDataMock.initial_data.general_settings.checkout_process, rsa_enabled: false}}});
        setTaxesMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));

        await updateOnShippingMethodSelected(initialDataMock.application_state.shipping.selected_shipping);

        expect(changeShippingLineMock).toHaveBeenCalledTimes(1);
        expect(setTaxesMock).toHaveBeenCalledTimes(1);
    });
});