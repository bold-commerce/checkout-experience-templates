import {mocked} from 'jest-mock';
import {baseReturnObject, validateAddress} from '@bold-commerce/checkout-frontend-library';
import {initialDataMock, stateMock} from 'src/mocks';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import * as setValid from 'src/action/appAction';
import {deleteAddress, postAddress, validateAddressFunction} from 'src/library';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';

jest.mock('@bold-commerce/checkout-frontend-library/lib/address');
jest.mock('src/library/deleteAddress');
jest.mock('src/library/postAddress');
const validateAddressMock = mocked(validateAddress, true);
const deleteAddressMock = mocked(deleteAddress, true);
const postAddressMock = mocked(postAddress, true);

describe('testing validateAddressFunction', () => {
    const returnObject = {...baseReturnObject};
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const postAddressReturnedFunctionMock = jest.fn();
    const deleteAddressReturnedFunctionMock = jest.fn();
    let handleErrorSpy: jest.SpyInstance;
    let setValidSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
        handleErrorSpy = jest.spyOn(handleErrorIfNeeded, 'handleErrorIfNeeded').mockImplementation();
        setValidSpy = jest.spyOn(setValid, 'actionSetAppStateValid');
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

        expect(validateAddressMock).toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name, shipping.phone_number, API_RETRY);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(0);
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

        expect(validateAddressMock).toHaveBeenCalledWith(billing.postal_code, billing.province,  billing.province_code, billing.country, billing.country_code, billing.business_name, billing.phone_number, API_RETRY);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(0);
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

        expect(validateAddressMock).toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name, shipping.phone_number, API_RETRY);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledWith('shippingAddress', false);
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

        expect(validateAddressMock).toHaveBeenCalledWith(billing.postal_code, billing.province, billing.province_code, billing.country, billing.country_code, billing.business_name, billing.phone_number, API_RETRY);
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledWith('billingAddress', false);
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
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledWith('billingAddress', false);
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
        expect(handleErrorSpy).toHaveBeenCalledTimes(0);
        expect(setValidSpy).toHaveBeenCalledTimes(2);
        expect(setValidSpy).toHaveBeenCalledWith('shippingAddress', true);
        expect(setValidSpy).toHaveBeenCalledWith('updatedShippingAddress', true);
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
        expect(handleErrorSpy).toHaveBeenCalledTimes(0);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledWith('billingAddress', true);
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
        expect(handleErrorSpy).toHaveBeenCalledTimes(1);
        expect(setValidSpy).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledTimes(8);
        expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
        expect(dispatchMock).toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
    });
});
