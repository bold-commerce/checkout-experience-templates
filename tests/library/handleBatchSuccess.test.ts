import {
    IApiSubrequestSuccessResponse,
    ISetBillingAddressResponse,
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    getCustomerFromLib,
    handleBatchSuccess,
    setBillingAddressAsValid,
    setDefaultShippingLine,
    setShippingAddressAsValid,
    setShippingLineAsValid,
    validateShippingLine
} from 'src/library';
import {stateMock} from 'src/mocks';
import {
    IAddGuestCustomerResponse,
    IGetShippingLinesResponse,
    ISetShippingAddressResponse
} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('src/action/appAction');
jest.mock('src/library/deleteAddress');
jest.mock('src/library/postAddress');
jest.mock('src/utils/handleErrorIfNeeded');
const validateShippingLineMock = mocked(validateShippingLine, true);
const setShippingAddressAsValidMock = mocked(setShippingAddressAsValid, true);
const setBillingAddressAsValidMock = mocked(setBillingAddressAsValid, true);
const getCustomerFromLibMock = mocked(getCustomerFromLib, true);
const setDefaultShippingLineMock = mocked(setDefaultShippingLine, true);
const setShippingLineAsValidMock = mocked(setShippingLineAsValid, true);


describe('testing handleBatchSuccess', () => {
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

        await handleBatchSuccess(dispatchMock, getStateMock, validateEmailSubrequest);

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

        await handleBatchSuccess(dispatchMock, getStateMock, addGuestCustomerSubrequest);

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

        await handleBatchSuccess(dispatchMock, getStateMock, addShippingSubrequest);

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

        await handleBatchSuccess(dispatchMock, getStateMock, addBillingSubrequest);

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

        await handleBatchSuccess(dispatchMock, getStateMock, getShippingSubrequest);

        expect(dispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).toHaveBeenCalledWith(validateShippingLineMock);
        expect(dispatchMock).toHaveBeenCalledWith(setDefaultShippingLineMock);
        expect(dispatchMock).toHaveBeenCalledWith(setShippingLineAsValidMock);
    });
});
