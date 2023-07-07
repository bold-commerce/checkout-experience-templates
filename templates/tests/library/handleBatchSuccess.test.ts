import {
    baseReturnObject,
    IApiSubrequestSuccessResponse, ISetBillingAddressResponse,
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    getCustomerFromLib,
    handleBatchSuccess,
    setBillingAddressAsValid,
    setShippingAddressAsValid, updateExternalPaymentGatewayShippingAddress,
    validateShippingLine
} from 'src/library';
import {stateMock} from 'src/mocks';
import {
    IAddGuestCustomerResponse, IGetShippingLinesResponse,
    ISetShippingAddressResponse
} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('src/action/appAction');
jest.mock('src/library/deleteAddress');
jest.mock('src/library/postAddress');
jest.mock('src/utils/handleErrorIfNeeded');
const validateShippingLineMock = mocked(validateShippingLine, true);
const updateExternalPaymentGatewayShippingAddressMock = mocked(updateExternalPaymentGatewayShippingAddress, true);
const setShippingAddressAsValidMock = mocked(setShippingAddressAsValid, true);
const setBillingAddressAsValidMock = mocked(setBillingAddressAsValid, true);
const getCustomerFromLibMock = mocked(getCustomerFromLib, true);


describe('testing handleBatchSuccess', () => {
    const returnObject = {...baseReturnObject};
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
        getStateMock.mockReturnValue(stateMock);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('handle validate email batch response', async () => {
        const validateEmailSubrequest: IApiSubrequestSuccessResponse = {
            'status_code': 200,
            'method': 'GET',
            'endpoint': '/validate_email_address'
        };

        const newReturnObj = {...returnObject, success: true};

        await handleBatchSuccess(dispatchMock, getStateMock, validateEmailSubrequest, newReturnObj);

        expect(dispatchMock).toHaveBeenCalledTimes(0);
        expect(getStateMock).toHaveBeenCalledTimes(1);
    });

    test('handle add guest customer batch response', async () => {
        const data: IAddGuestCustomerResponse = {
            application_state: undefined,
            customer: stateMock.data.application_state.customer
        };
        const addGuestCustomerSubrequest: IApiSubrequestSuccessResponse = {
            'data': data,
            'status_code': 200,
            'method': 'POST',
            'endpoint': '/customer/guest'
        };

        const newReturnObj = {...returnObject, success: true};

        await handleBatchSuccess(dispatchMock, getStateMock, addGuestCustomerSubrequest, newReturnObj);

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(getCustomerFromLibMock);
    });

    test('handle shipping address batch response', async () => {
        const data: ISetShippingAddressResponse = {
            application_state: undefined,
            address: stateMock.data.application_state.addresses.shipping
        };
        const addShippingSubrequest: IApiSubrequestSuccessResponse = {
            'data': data,
            'status_code': 200,
            'method': 'POST',
            'endpoint': '/addresses/shipping'
        };

        const newReturnObj = {...returnObject, success: true};

        await handleBatchSuccess(dispatchMock, getStateMock, addShippingSubrequest, newReturnObj);

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(setShippingAddressAsValidMock);
    });

    test('handle billing address batch response', async () => {
        const data: ISetBillingAddressResponse = {
            application_state: undefined,
            address: stateMock.data.application_state.addresses.shipping
        };
        const addBillingSubrequest: IApiSubrequestSuccessResponse = {
            'data': data,
            'status_code': 200,
            'method': 'POST',
            'endpoint': '/addresses/billing'
        };

        const newReturnObj = {...returnObject, success: true};

        await handleBatchSuccess(dispatchMock, getStateMock, addBillingSubrequest, newReturnObj);

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(setBillingAddressAsValidMock);
    });

    test('handle shipping lines batch response', async () => {
        const data: IGetShippingLinesResponse = {
            application_state: undefined,
            shipping_lines: stateMock.data.application_state.shipping.available_shipping_lines
        };
        const getShippingSubrequest: IApiSubrequestSuccessResponse = {
            'data': data,
            'status_code': 200,
            'method': 'POST',
            'endpoint': '/shipping_lines'
        };

        const newReturnObj = {...returnObject, success: true};

        await handleBatchSuccess(dispatchMock, getStateMock, getShippingSubrequest, newReturnObj);

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(validateShippingLineMock);
    });
});
