import fetchMock from "jest-fetch-mock";
import { mocked } from 'jest-mock';
import { metaOnPaymentConsent } from 'src/themes/flow-sdk/meta/metaOnPaymentConsent';
import { IMetaPaymentResponse, IOnAction, IProcessOrderResponse } from 'src/themes/flow-sdk/types';
import {
    callBillingAddressEndpoint,
    callGuestCustomerEndpoint,
    callShippingAddressEndpoint,
    getTotals,
} from '@boldcommerce/checkout-express-pay-library';
import {
    baseReturnObject,
    setTaxes,
    getCurrency,
    addPayment,
    processOrder,
    IApiSuccessResponse,
} from '@boldcommerce/checkout-frontend-library';
import { MetaPaymentDetailsMock } from 'src/themes/flow-sdk/mocks/paymentMocks';
import {
    META_AUTHORIZATION_BILLING_ERROR,
    META_AUTHORIZATION_OTHER_ERROR,
    META_AUTHORIZATION_SHIPPING_ERROR,
    META_AUTHORIZATION_PAYMENT_ERROR,
    META_AUTHORIZATION_ERROR,
    META_AUTHORIZATION_SUCCESS,
} from 'src/themes/flow-sdk/constants';
import { checkoutFlow } from 'src/themes/flow-sdk/flowState';
import {
    MetaPaymentConfiguration,
    CurrencyMock,
    TotalMock,
} from 'src/themes/flow-sdk/mocks/paymentMocks';
import { initialDataMock } from 'src/mocks/orderIntializationDataMock';

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callGuestCustomerEndpoint');
const callGuestCustomerEndpointMock = mocked(callGuestCustomerEndpoint, true);

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callShippingAddressEndpoint');
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callBillingAddressEndpoint');
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
const setTaxesMock = mocked(setTaxes, true);

jest.mock('src/themes/flow-sdk/flowState')
const checkoutFlowMock = mocked(checkoutFlow, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getCurrency');
const getCurrencyMock = mocked(getCurrency, true);

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/getTotals');
const getTotalsMock = mocked(getTotals, true);


jest.mock('@boldcommerce/checkout-frontend-library/lib/payment');
const addPaymentMock = mocked(addPayment, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/order/processOrder');
const processOrderMock = mocked(processOrder, true);

jest.mock('src/themes/flow-sdk/logger')

var respBilling: IMetaPaymentResponse = {
    requestId: "123",
    container: {
        mode: 'TEST',
        containerId: '123',
        containerType: 'basic-card-v1',
        containerData: '123'
    },
    containerDescription: '123',
    billingAddress: MetaPaymentDetailsMock.billingAddress
}

describe('metaOnPaymentConsent', () => {
    beforeAll(() => {
        fetchMock.enableMocks();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock.resetMocks();
    });

    it('META_AUTHORIZATION_OTHER_ERROR', async () => {
        var resp: IMetaPaymentResponse = {
            requestId: "123",
            container: {
                mode: 'TEST',
                containerId: '123',
                containerType: 'basic-card-v1',
                containerData: '123'
            },
            containerDescription: '123',
            shippingAddress: MetaPaymentDetailsMock.shippingAddress,
            billingAddress: MetaPaymentDetailsMock.billingAddress
        }

        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve(baseReturnObject));

        await metaOnPaymentConsent(resp).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_OTHER_ERROR);
        });

        expect(callGuestCustomerEndpointMock).toBeCalledTimes(1);
    });


    it('META_AUTHORIZATION_OTHER_ERROR billingAddress', async () => {
        var resp: IMetaPaymentResponse = {
            requestId: "123",
            container: {
                mode: 'TEST',
                containerId: '123',
                containerType: 'basic-card-v1',
                containerData: '123'
            },
            containerDescription: '123',

        }

        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve(baseReturnObject));

        await metaOnPaymentConsent(resp).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_OTHER_ERROR);
        });

        expect(callGuestCustomerEndpointMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_OTHER_ERROR shippingAddress recipient not set', async () => {
        var resp: IMetaPaymentResponse = {
            requestId: "123",
            container: {
                mode: 'TEST',
                containerId: '123',
                containerType: 'basic-card-v1',
                containerData: '123'
            },
            containerDescription: '123',
            shippingAddress: {
                addressLine: MetaPaymentDetailsMock.shippingAddress?.addressLine || [],
                city: MetaPaymentDetailsMock.shippingAddress?.city || "",
                country: MetaPaymentDetailsMock.shippingAddress?.country || "",
                dependentLocality: MetaPaymentDetailsMock.shippingAddress?.dependentLocality || "",
                organization: MetaPaymentDetailsMock.shippingAddress?.organization || "",
                phone: MetaPaymentDetailsMock.shippingAddress?.phone || "",
                postalCode: MetaPaymentDetailsMock.shippingAddress?.postalCode || "",
                region: MetaPaymentDetailsMock.shippingAddress?.region || "",
                recipient: undefined,
            },
        }

        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve(baseReturnObject));

        await metaOnPaymentConsent(resp).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_OTHER_ERROR);
        });

        expect(callGuestCustomerEndpointMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_SHIPPING_ERROR', async () => {

        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve(baseReturnObject));


        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_SHIPPING_ERROR);
        });


        expect(callShippingAddressEndpointMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_BILLING_ERROR', async () => {
        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve(baseReturnObject));

        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_BILLING_ERROR);
        });

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1);
    });

    it('META_AUTHORIZATION_PAYMENT_ERROR', async () => {
        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve(baseReturnObject));

        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_OTHER_ERROR);
        });

        expect(setTaxesMock).toBeCalledTimes(1);
    });

    it('Tokenize containerData Error', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ success: false }), {
                status: 400,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_PAYMENT_ERROR);
        });
    });


    it('addPayment Error META_AUTHORIZATION_PAYMENT_ERROR', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        addPaymentMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: false }));

        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_PAYMENT_ERROR);
        });
    });


    it('processOrder Error META_AUTHORIZATION_ERROR', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        addPaymentMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        processOrderMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: false }));

        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_ERROR);
        });
    });


    it('processOrder Error META_AUTHORIZATION_SUCCESS', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        addPaymentMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));

        var responseOrderData: IProcessOrderResponse = {
            application_state: {
                ...initialDataMock.application_state,
                is_processed: true,
            },
        }

        processOrderMock.mockReturnValue(Promise.resolve({
            ...baseReturnObject, success: true,
            response: {
                data: responseOrderData
            } as IApiSuccessResponse
        }));

        expect(await metaOnPaymentConsent(respBilling)).toEqual(META_AUTHORIZATION_SUCCESS);
    });


    it('is_processed is false, META_AUTHORIZATION_ERROR', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        addPaymentMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));

        var responseOrderData: IProcessOrderResponse = {
            application_state: {
                ...initialDataMock.application_state,
                is_processed: false,
            },
        }

        processOrderMock.mockReturnValue(Promise.resolve({
            ...baseReturnObject, success: true,
            response: {
                data: responseOrderData
            } as IApiSuccessResponse
        }));


        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_ERROR);
        });
    });


    it('bad application state', async () => {
        checkoutFlowMock.flow_settings = {
            is_test_mode: true,
            partner_id: MetaPaymentConfiguration.partnerId,
            partner_merchant_id: MetaPaymentConfiguration.partnerMerchantId,
        }
        checkoutFlowMock.params = {
            shopIdentifier: "test",
            flowElementId: "test",
            environment: {
                type: "test",
                url: "https://test.com",
                path: "/test",
            },
            boldSecureUrl: "https://secure.boldcommerce.com",
            // @ts-ignore
            onAction: jest.fn() as IOnAction,
        }


        callGuestCustomerEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        setTaxesMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));
        fetchMock.mockReturnValue(Promise.resolve(
            new Response(JSON.stringify({ data: { token: "test" } }), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
        ));

        getCurrencyMock.mockReturnValue(CurrencyMock);
        getTotalsMock.mockReturnValue(TotalMock);
        addPaymentMock.mockReturnValue(Promise.resolve({ ...baseReturnObject, success: true }));

        var responseOrderData: IProcessOrderResponse = {
            application_state: undefined,
        }

        processOrderMock.mockReturnValue(Promise.resolve({
            ...baseReturnObject, success: true,
            response: {
                data: responseOrderData
            } as IApiSuccessResponse
        }));


        await metaOnPaymentConsent(respBilling).catch((e) => {
            expect(e).toEqual(META_AUTHORIZATION_ERROR);
        });
    });
})