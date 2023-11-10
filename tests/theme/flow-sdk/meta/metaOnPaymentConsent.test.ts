import fetchMock from "jest-fetch-mock";
import {mocked} from 'jest-mock';
import {metaOnPaymentConsent} from 'src/themes/flow-sdk/meta/metaOnPaymentConsent';
import {IMetaPaymentResponse} from 'src/themes/flow-sdk/types';
import {getTotals} from '@boldcommerce/checkout-express-pay-library';
import {
    addPayment,
    baseReturnObject,
    batchRequest,
    getApplicationState,
    getBillingAddress,
    getCurrency,
    getOrderInitialData,
    getShippingAddress,
    processOrder,
} from '@boldcommerce/checkout-frontend-library';
import {MetaPaymentDetailsMock} from 'src/themes/flow-sdk/mocks/paymentMocks';
import {
    META_AUTHORIZATION_BILLING_ERROR,
    META_AUTHORIZATION_OTHER_ERROR,
    META_AUTHORIZATION_SHIPPING_ERROR,
    META_AUTHORIZATION_PAYMENT_ERROR,
    META_AUTHORIZATION_ERROR,
    META_AUTHORIZATION_SUCCESS,
} from 'src/themes/flow-sdk/constants';
import {checkoutFlow} from 'src/themes/flow-sdk/flowState';
import {
    MetaPaymentConfiguration,
    CurrencyMock,
    TotalMock,
} from 'src/themes/flow-sdk/mocks/paymentMocks';
import {initialDataMock} from 'src/mocks/orderIntializationDataMock';
import {IApiSubrequestResponse} from "@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces";

jest.mock('@boldcommerce/checkout-frontend-library/lib/batch/batchRequest');
const batchRequestMock = mocked(batchRequest, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getApplicationState');
const getApplicationStateMock = mocked(getApplicationState, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getBillingAddress');
const getBillingAddressMock = mocked(getBillingAddress, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
const getCurrencyMock = mocked(getCurrency, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getOrderInitialData');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShippingAddress');
const getShippingAddressMock = mocked(getShippingAddress, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/order/processOrder');
const processOrderMock = mocked(processOrder, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/payment/addPayment');
const addPaymentMock = mocked(addPayment, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/log/addLog');

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/getTotals');
const getTotalsMock = mocked(getTotals, true);

jest.mock('src/themes/flow-sdk/logger')

const onActionMock = jest.fn();

const baseMetaResponse: IMetaPaymentResponse = {
    requestId: "123",
    container: {
        mode: 'TEST',
        containerId: '123',
        containerType: 'basic-card-v1',
        containerData: '123'
    },
    containerDescription: '123'
};

const completeMetaResponse: IMetaPaymentResponse = {
    ...baseMetaResponse,
    shippingAddress: MetaPaymentDetailsMock.shippingAddress,
    billingAddress: MetaPaymentDetailsMock.billingAddress
};

const billingOnlyMetaResponse: IMetaPaymentResponse = {
    ...baseMetaResponse,
    billingAddress: MetaPaymentDetailsMock.billingAddress
};

describe('metaOnPaymentConsent', () => {
    beforeAll(() => {
        fetchMock.enableMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();

        getApplicationStateMock.mockReturnValue(initialDataMock.application_state);
        getBillingAddressMock.mockReturnValue(initialDataMock.application_state.addresses.billing);
        getCurrencyMock.mockReturnValue(CurrencyMock);
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
        getShippingAddressMock.mockReturnValue(initialDataMock.application_state.addresses.shipping);
        getTotalsMock.mockReturnValue(TotalMock);
        batchRequestMock.mockReturnValue(Promise.resolve(baseReturnObject));
        addPaymentMock.mockReturnValue(Promise.resolve(baseReturnObject));
        processOrderMock.mockReturnValue(Promise.resolve(baseReturnObject));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
            status: 200,
            statusText: 'OK',
            headers: {'Content-Type': 'application/json'},
        })));

        checkoutFlow.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        };
        checkoutFlow.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            onAction: onActionMock,
        };
    });

    it('META_AUTHORIZATION_SUCCESS', async () => {
        const expectedApplicationState = {...initialDataMock.application_state, is_processed: true};
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        addPaymentMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        processOrderMock.mockReturnValueOnce(Promise.resolve({
            ...baseReturnObject,
            success: true,
            response: {data: {application_state: expectedApplicationState}}
        }));

        const response = await metaOnPaymentConsent(completeMetaResponse);

        expect(batchRequestMock).toBeCalledTimes(1);
        expect(response).toBe(META_AUTHORIZATION_SUCCESS);
        expect(onActionMock).toHaveBeenCalledTimes(1);
        expect(onActionMock).toHaveBeenCalledWith('FLOW_ORDER_COMPLETED', {application_state: expectedApplicationState});
    });

    it('META_AUTHORIZATION_ERROR when batch successful but is_processed false', async () => {
        const expectedApplicationState = {...initialDataMock.application_state, is_processed: false};
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        addPaymentMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        processOrderMock.mockReturnValueOnce(Promise.resolve({
            ...baseReturnObject,
            success: true,
            response: {data: {application_state: expectedApplicationState}}
        }));

        await metaOnPaymentConsent(completeMetaResponse).catch((error) => {
            expect(error).toStrictEqual({
                ...META_AUTHORIZATION_ERROR,
                error: {
                    message: "There was an unknown error while processing your payment.",
                    reason: "INVALID_PAYMENT_DATA",
                }
            });
        });

        expect(batchRequestMock).toBeCalledTimes(1);
        expect(onActionMock).toHaveBeenCalledTimes(0);
    });

    it('META_AUTHORIZATION_ERROR when batch successful but missing application_state', async () => {
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        addPaymentMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        processOrderMock.mockReturnValueOnce(Promise.resolve({
            ...baseReturnObject,
            success: true,
            response: {data: {application_state: undefined}}
        }));

        await metaOnPaymentConsent(completeMetaResponse).catch((error) => {
            expect(error).toStrictEqual({
                ...META_AUTHORIZATION_ERROR,
                error: {
                    message: "There was an unknown error while processing your payment.",
                    reason: "INVALID_PAYMENT_DATA",
                }
            });            
        });

        expect(batchRequestMock).toBeCalledTimes(1);
        expect(onActionMock).toHaveBeenCalledTimes(0);
    });

    it('META_AUTHORIZATION_OTHER_ERROR when invalid data from fail batch response', async () => {
        await metaOnPaymentConsent(completeMetaResponse).catch((error) => {
            expect(error).toStrictEqual({
                ...META_AUTHORIZATION_OTHER_ERROR,
                error: {
                    message: "This application has encountered an error",
                    reason: "OTHER_ERROR",
                }
            });             
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_OTHER_ERROR fail on guest customer subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/customer/guest', method: 'POST'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_OTHER_ERROR,
                error: {
                    message: "This application has encountered an error",
                    reason: "OTHER_ERROR",
                }
            });              
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_OTHER_ERROR fail on customer subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/customer', method: 'PUT'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_OTHER_ERROR,
                error: {
                    message: "This application has encountered an error",
                    reason: "OTHER_ERROR",
                }
            });             
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_SHIPPING_ERROR fail on shipping address subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{
            status_code: 422,
            endpoint: '/addresses/shipping',
            method: 'POST',
            errors: [{
                message: '',
                type: 'address',
                field: 'postal_code',
                severity: 'validation',
                sub_type: '',
            }]
        }];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_SHIPPING_ERROR,
                error: {
                    field: "postalCode",
                    message: "Code not valid for country and province.",
                    reason: "INVALID_SHIPPING_ADDRESS",
                }
            });             
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_BILLING_ERROR fail on billing address subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{
            status_code: 422,
            endpoint: '/addresses/billing',
            method: 'POST',
            errors: [{
                message: '',
                type: 'address',
                field: 'province',
                severity: 'validation',
                sub_type: '',
            }]            
        }];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_BILLING_ERROR,
                error: {
                    field: "region",
                    message: "Please select a province/state/territory",
                    reason: "INVALID_BILLING_ADDRESS",
                }
            });            
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_OTHER_ERROR fail on taxes subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/taxes', method: 'POST'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_OTHER_ERROR,
                error: {
                    message: "We are not able to calculate taxes on your order.",
                    reason: "OTHER_ERROR",
                }
            });              
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_PAYMENT_ERROR fail on add payment', async () => {
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_PAYMENT_ERROR,
                error: {
                    message: "There was an unknown error while processing your payment.",
                    reason: "INVALID_PAYMENT_DATA",
                }
            });            
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_ERROR fail on process order', async () => {
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        addPaymentMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_ERROR,
                error: {
                    message: "There was an unknown error while processing your payment.",
                    reason: "INVALID_PAYMENT_DATA",
                }
            });            
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_OTHER_ERROR fail on any other subrequest', async () => {
        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/any_other_subrequest', method: 'POST'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        await metaOnPaymentConsent(baseMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_OTHER_ERROR,
                error: {
                    message: "This application has encountered an error",
                    reason: "OTHER_ERROR",
                }
            });              
        });

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('Tokenize containerData Error', async () => {
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: true}));
        fetchMock.mockReturnValueOnce(Promise.resolve(
            new Response(JSON.stringify({ success: false }), {
                status: 400,
                statusText: 'Fail',
                headers: {'Content-Type': 'application/json'},
            })));

        await metaOnPaymentConsent(billingOnlyMetaResponse).catch((e) => {
            expect(e).toStrictEqual({
                ...META_AUTHORIZATION_PAYMENT_ERROR,
                error: {
                    message: "There was an unknown error while processing your payment.",
                    reason: "INVALID_PAYMENT_DATA",
                }
            });             
        });
    });
})