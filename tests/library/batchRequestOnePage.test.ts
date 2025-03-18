import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {
    validateBatchResponse,
    batchRequestOnePage,
    getPayloadForPostShippingAddress,
    getPayloadForPostBillingAddress,
    getPayloadForGetShippingLines, getPayloadForGenerateTaxes,
} from 'src/library';
import {actionSetAppStateValid, actionSetButtonDisable, actionSetLoader} from 'src/action';
import {apiTypeKeys, baseReturnObject, batchRequest, IBatchableRequest} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/action');
jest.mock('src/library/validateBatchResponse');
jest.mock('src/library/getPayloadForPostShippingAddress');
jest.mock('src/library/getPayloadForPostBillingAddress');
jest.mock('src/library/getPayloadForGetShippingLines');
jest.mock('src/library/getPayloadForGenerateTaxes');
jest.mock('@boldcommerce/checkout-frontend-library/lib/batch');

const batchRequestMock = mocked(batchRequest, true);
const validateBatchResponseMock = mocked(validateBatchResponse, true);
const actionSetLoaderMock = mocked(actionSetLoader, true);
const actionSetButtonDisableMock = mocked(actionSetButtonDisable, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const getPayloadForPostShippingAddressMock = mocked(getPayloadForPostShippingAddress, true);
const getPayloadForPostBillingAddressMock = mocked(getPayloadForPostBillingAddress, true);
const getPayloadForGetShippingLinesMock = mocked(getPayloadForGetShippingLines, true);
const getPayloadForGenerateTaxesMock = mocked(getPayloadForGenerateTaxes, true);

describe('testing batchRequestOnePage', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const successReturnObject = {...baseReturnObject, success: true};

    beforeEach(() => {
        jest.resetAllMocks();
        validateBatchResponseMock.mockReturnValue(Promise.resolve());
        batchRequestMock.mockReturnValue(Promise.resolve(successReturnObject));
    });

    test('Send batch request with require shipping', async () => {
        const newStateMock = {...stateMock};
        newStateMock.data.initial_data.requires_shipping = true;
        getState.mockReturnValueOnce(newStateMock);

        getPayloadForPostShippingAddressMock.mockReturnValue({apiType: apiTypeKeys.setShippingAddress, payload: {}} as IBatchableRequest);
        getPayloadForPostBillingAddressMock.mockReturnValue({apiType: apiTypeKeys.setBillingAddress, payload: {}} as IBatchableRequest);
        getPayloadForGetShippingLinesMock.mockReturnValue({apiType: apiTypeKeys.getShippingLines, payload: {}} as IBatchableRequest);
        getPayloadForGenerateTaxesMock.mockReturnValue({apiType: apiTypeKeys.setTaxes, payload: {}} as IBatchableRequest);

        const batchRequestOnePageThunk = batchRequestOnePage(true, true, true);
        await batchRequestOnePageThunk(dispatch, getState).then(() => {
            expect(actionSetLoaderMock).toHaveBeenCalledTimes(1);
            expect(getPayloadForPostShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(getPayloadForPostBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(getPayloadForGetShippingLinesMock).toHaveBeenCalledTimes(1);
            expect(getPayloadForGenerateTaxesMock).toHaveBeenCalledTimes(1);
            expect(batchRequestMock).toHaveBeenCalledTimes(1);
            expect(validateBatchResponseMock).toHaveBeenCalledTimes(1);
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(1);
            expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(0);
        });
    });

    test('Send batch request with not require shipping', async () => {
        getState.mockReturnValueOnce(stateMock);

        getPayloadForPostShippingAddressMock.mockReturnValue({apiType: apiTypeKeys.setShippingAddress, payload: {}} as IBatchableRequest);
        getPayloadForPostBillingAddressMock.mockReturnValue({apiType: apiTypeKeys.setBillingAddress, payload: {}} as IBatchableRequest);
        getPayloadForGetShippingLinesMock.mockReturnValue(null);
        getPayloadForGenerateTaxesMock.mockReturnValue({apiType: apiTypeKeys.setTaxes, payload: {}} as IBatchableRequest);

        const batchRequestOnePageThunk = batchRequestOnePage(true, true, false);
        await batchRequestOnePageThunk(dispatch, getState).then(() => {
            expect(batchRequestMock).toHaveBeenCalledTimes(1);
            expect(validateBatchResponseMock).toHaveBeenCalledTimes(1);
            expect(actionSetLoaderMock).toHaveBeenCalledTimes(2);
            expect(actionSetAppStateValidMock).toHaveBeenCalledTimes(2);
            expect(actionSetButtonDisableMock).toHaveBeenCalledTimes(1);
        });
    });

    test('Not send batch request when the payload is empty', async () => {
        getState.mockReturnValueOnce(stateMock);

        getPayloadForPostShippingAddressMock.mockReturnValue(null);
        getPayloadForPostBillingAddressMock.mockReturnValue(null);
        getPayloadForGetShippingLinesMock.mockReturnValue(null);
        getPayloadForGenerateTaxesMock.mockReturnValue(null);

        const batchRequestOnePageThunk = batchRequestOnePage(true, true, false);
        await batchRequestOnePageThunk(dispatch, getState).then(() => {
            expect(batchRequestMock).toHaveBeenCalledTimes(0);
        });
    });
});
