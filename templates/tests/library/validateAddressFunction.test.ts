import {baseReturnObject, validateAddress} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionSetAppStateValid} from 'src/action/appAction';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';
import {deleteAddress, postAddress, validateAddressFunction} from 'src/library';
import {initialDataMock, stateMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils/handleErrorIfNeeded';

jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('src/action/appAction');
jest.mock('src/library/deleteAddress');
jest.mock('src/library/postAddress');
jest.mock('src/utils/handleErrorIfNeeded');
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const validateAddressMock = mocked(validateAddress, true);
const deleteAddressMock = mocked(deleteAddress, true);
const postAddressMock = mocked(postAddress, true);

describe('testing validateAddressFunction', () => {
    const returnObject = {...baseReturnObject};
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const postAddressReturnedFunctionMock = jest.fn();
    const deleteAddressReturnedFunctionMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
        deleteAddressMock.mockReturnValue(deleteAddressReturnedFunctionMock);
        postAddressMock.mockReturnValue(postAddressReturnedFunctionMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling validate address endpoint with success for shipping ', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = initialDataMock.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).toHaveBeenCalledWith(shipping.first_name, shipping.last_name, shipping.address_line_1, shipping.address_line_2, shipping.city, shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name, shipping.phone_number, API_RETRY);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint with success for billing', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {billing} = initialDataMock.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, billing, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).toHaveBeenCalledWith(billing.first_name, billing.last_name, billing.address_line_1, billing.address_line_2, billing.city,billing.postal_code, billing.province,  billing.province_code, billing.country, billing.country_code, billing.business_name, billing.phone_number, API_RETRY);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(0);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint where validateAddressFields is returning false for Shipping', async () => {
        const newReturnObj = {...returnObject, success: true};
        const shipping = {
            ...initialDataMock.application_state.addresses.shipping,
            first_name: '',
        };
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).toHaveBeenCalledWith(shipping.first_name, shipping.last_name, shipping.address_line_1, shipping.address_line_2, shipping.city,shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name, shipping.phone_number, API_RETRY);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', false);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);

    });

    test('calling validate address endpoint where validateAddressFields is returning false for billing', async () => {
        const newReturnObj = {...returnObject, success: true};
        const billing = {
            ...initialDataMock.application_state.addresses.billing,
            first_name: '',
        };
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, billing, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).toHaveBeenCalledWith(billing.first_name, billing.last_name, billing.address_line_1, billing.address_line_2, billing.city,billing.postal_code, billing.province, billing.province_code, billing.country, billing.country_code, billing.business_name, billing.phone_number, API_RETRY);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('billingAddress', false);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint with same default address', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {first_name, last_name, address_line_1, country_code, city} = defaultAddressState;
        const validationField = {first_name, last_name, address_line_1, country_code, city};
        const validationFieldParams = [validationField, Constants.BILLING, dispatchMock];
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue({
            ...stateMock,
            data: {
                ...stateMock.data,
                application_state: {
                    ...stateMock.data.application_state,
                    addresses: {
                        ...stateMock.data.application_state.addresses,
                        billing: defaultAddressState,
                    },
                },
                initial_data: {
                    ...stateMock.data.initial_data,
                    general_settings: {
                        ...stateMock.data.initial_data.general_settings,
                        checkout_process: {
                            ...stateMock.data.initial_data.general_settings.checkout_process,
                            phone_number_required: true,
                        },
                    },
                },
            },
        });

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, defaultAddressState, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).not.toHaveBeenCalledWith(...validationFieldParams);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('billingAddress', false);
        expect(dispatchMock).toHaveBeenCalledTimes(9);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint with same address object for shipping', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = stateMock.data.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, shipping);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).not.toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.country_code);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(2);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('shippingAddress', true);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('updatedShippingAddress', true);
        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint with same address object for billing', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {billing} = stateMock.data.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, billing, billing);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).not.toHaveBeenCalledWith(billing.postal_code, billing.province, billing.country_code);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledWith('billingAddress', true);
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });

    test('calling validate address endpoint with empty address that is different than before', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = initialDataMock.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValue({
            ...stateMock,
            data: {
                ...stateMock.data,
                initial_data: {
                    ...stateMock.data.initial_data,
                    general_settings: {
                        ...stateMock.data.initial_data.general_settings,
                        checkout_process: undefined,
                    },
                },
            },
        });

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, defaultAddressState, shipping);
        await validateCustomerAddressThunk(dispatchMock, getStateMock);

        expect(validateAddressMock).not.toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.country_code);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(8);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });
});
