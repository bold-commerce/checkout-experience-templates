import {
    baseReturnObject, IApiBatchResponse, IApiSubrequestErrorsResponse,
    IApiSubrequestSuccessResponse,
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {
    handleBatchSuccess,
    validateBatchResponse,
} from 'src/library';
import {stateMock} from 'src/mocks';
import {applicationStateMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('src/library/handleBatchSuccess');
jest.mock('src/utils/handleErrorIfNeeded');
const handleBatchSuccessMock = mocked(handleBatchSuccess, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);


describe('testing validateBatchResponse', () => {
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

    const validateEmailSubrequest: IApiSubrequestSuccessResponse = {
        'status_code': 200,
        'method': 'GET',
        'endpoint': '/validate_email_address'
    };

    const addGuestCustomerSubrequest: IApiSubrequestSuccessResponse = {
        'data': {
            application_state: undefined,
            customer: stateMock.data.application_state.customer
        },
        'status_code': 200,
        'method': 'POST',
        'endpoint': '/customer/guest'
    };

    const addShippingSubrequest: IApiSubrequestSuccessResponse = {
        'data': {
            application_state: undefined,
            address: stateMock.data.application_state.addresses.shipping
        },
        'status_code': 200,
        'method': 'POST',
        'endpoint': '/addresses/shipping'
    };

    const addShippingSubrequestFail: IApiSubrequestErrorsResponse = {
        'errors': [
            {
                'message': 'The postal code provided is not valid.',
                'type': 'order',
                'field': 'postal_code',
                'severity': 'validation',
                'sub_type': 'shipping_address'
            }
        ],
        'status_code': 400,
        'method': 'POST',
        'endpoint': '/addresses/shipping'
    };

    const addBillingSubrequest: IApiSubrequestSuccessResponse = {
        'data': {
            application_state: undefined,
            address: stateMock.data.application_state.addresses.billing
        },
        'status_code': 200,
        'method': 'POST',
        'endpoint': '/addresses/billing'
    };

    test('handle validateBatchResponse with fail', async () => {
        const batchResponse : IApiBatchResponse = {
            data: [validateEmailSubrequest , addGuestCustomerSubrequest, addShippingSubrequestFail],
            application_state: applicationStateMock
        };

        const newReturnObj = {...returnObject, success: false, response: batchResponse, errors: [
            {
                'message': 'The postal code provided is not valid.',
                'type': 'order',
                'field': 'postal_code',
                'severity': 'validation',
                'sub_type': 'shipping_address'
            }
        ]};

        await validateBatchResponse(dispatchMock, getStateMock, newReturnObj);

        expect(handleBatchSuccessMock).toHaveBeenCalledTimes(2);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });

    test('handle validateBatchResponse with no fails', async () => {
        const batchResponse : IApiBatchResponse = {
            data: [validateEmailSubrequest , addGuestCustomerSubrequest, addShippingSubrequest, addBillingSubrequest],
            application_state: applicationStateMock
        };

        const newReturnObj = {...returnObject, success: true, response: batchResponse};

        await validateBatchResponse(dispatchMock, getStateMock, newReturnObj);

        expect(handleBatchSuccessMock).toHaveBeenCalledTimes(4);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
    });

    test('handle validateBatchResponse with fail, no data', async () => {
        const newReturnObj = {...returnObject, success: false,  errors: [
            {
                'code': '02-00',
                'message': 'Something went wrong. Please try again later.',
                'type': 'checkout.unexpected_error'
            }
        ]};

        await validateBatchResponse(dispatchMock, getStateMock, newReturnObj);

        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });
});
