import {mocked} from 'ts-jest/utils';
import {validateAddress} from '@bold-commerce/checkout-frontend-library';
import {initialDataMock, stateMock} from 'src/mocks';
import * as handleErrorIfNeeded from 'src/utils/handleErrorIfNeeded';
import * as setValid from 'src/action/appAction';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {deleteAddress, postAddress, validateAddressFunction} from 'src/library';
import {Constants, defaultAddressState} from 'src/constants';

jest.mock('@bold-commerce/checkout-frontend-library');
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
        getStateMock.mockReturnValueOnce(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint with success for billing', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {billing} = initialDataMock.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValueOnce(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, billing, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).toHaveBeenCalledWith(billing.postal_code, billing.province,  billing.province_code, billing.country, billing.country_code, billing.business_name);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint where validateAddressFields is returning true for Shipping', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = initialDataMock.application_state.addresses;
        shipping.first_name = '';
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValueOnce(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.province_code, shipping.country, shipping.country_code, shipping.business_name);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledWith('shippingAddress', false);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint where validateAddressFields is returning true for billing', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {billing} = initialDataMock.application_state.addresses;
        billing.first_name = '';
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValueOnce(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, billing, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).toHaveBeenCalledWith(billing.postal_code, billing.province, billing.province_code, billing.country, billing.country_code, billing.business_name);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint with same default address', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {first_name, last_name, address_line_1, country_code, city} = defaultAddressState;
        const validationField = {first_name, last_name, address_line_1, country_code, city};
        const validationFieldParams = [validationField, Constants.BILLING, dispatchMock];
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const getStateReturn = {...stateMock};
        getStateReturn.data.application_state.addresses.billing = defaultAddressState;
        getStateReturn.data.initial_data.general_settings.checkout_process.phone_number_required = true;
        getStateMock.mockReturnValueOnce(getStateReturn);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.BILLING, defaultAddressState, defaultAddressState);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).not.toHaveBeenCalledWith(...validationFieldParams);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(7);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint with same address object for shipping', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = stateMock.data.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        getStateMock.mockReturnValueOnce(stateMock);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, shipping, shipping);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).not.toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.country_code);
            expect(handleErrorSpy).toHaveBeenCalledTimes(0);
            expect(setValidSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledWith('shippingAddress', true);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).not.toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });

    test('calling validate address endpoint with empty address that is different than before', async () => {
        const newReturnObj = {...returnObject, success: true};
        const {shipping} = initialDataMock.application_state.addresses;
        validateAddressMock.mockReturnValueOnce(Promise.resolve(newReturnObj));
        const getStateReturn = {...stateMock};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getStateReturn.data.initial_data.general_settings.checkout_process = undefined;
        getStateMock.mockReturnValueOnce(getStateReturn);

        const validateCustomerAddressThunk = validateAddressFunction(Constants.SHIPPING, defaultAddressState, shipping);
        await validateCustomerAddressThunk(dispatchMock, getStateMock).then(() => {
            expect(validateAddressMock).not.toHaveBeenCalledWith(shipping.postal_code, shipping.province, shipping.country_code);
            expect(handleErrorSpy).toHaveBeenCalledTimes(1);
            expect(setValidSpy).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(8);
            expect(dispatchMock).not.toHaveBeenCalledWith(postAddressReturnedFunctionMock);
            expect(dispatchMock).toHaveBeenCalledWith(deleteAddressReturnedFunctionMock);
        });
    });
});
