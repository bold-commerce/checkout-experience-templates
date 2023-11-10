import { mocked } from 'jest-mock';
import { metaOnPaymentDetailsChanged } from 'src/themes/flow-sdk/meta';
import {
    getShipping,
    baseReturnObject,
    getDiscounts,
    batchRequest
} from '@boldcommerce/checkout-frontend-library';
import { IMetaPaymentDetailsChangedEvent } from 'src/themes/flow-sdk/types';
import { MetaPaymentDetailsMock } from 'src/themes/flow-sdk/mocks/paymentMocks';
import {discountMock, shippingMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {IApiSubrequestResponse} from "@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces";

jest.mock('@boldcommerce/checkout-frontend-library/lib/batch');
const batchRequestMock = mocked(batchRequest, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
const getShippingMock = mocked(getShipping, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getDiscounts');
const getDiscountsMock = mocked(getDiscounts, true);

describe('metaOnPaymentDetailsChanged', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getShippingMock.mockReturnValue(shippingMock);
        getDiscountsMock.mockReturnValue([discountMock]);
        batchRequestMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
    });

    it('metaOnPaymentDetailsChanged no changeTypes', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: [],
            paymentDetails: {
                total: {
                    amount: {
                        currency: 'CAD',
                        value: '29.99'
                    },
                    label: 'Total',
                },
                shippingAddress: MetaPaymentDetailsMock.shippingAddress,
                billingAddress: MetaPaymentDetailsMock.billingAddress,
            },
        };

        await metaOnPaymentDetailsChanged(event)
    });

    it('metaOnPaymentDetailsChanged with SHIPPING_ADDRESS', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['SHIPPING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with SHIPPING_ADDRESS and unsuccessful shippingAddressResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['SHIPPING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/addresses/shipping', method: 'POST'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        const result = await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
        expect(result.errors?.length).toBe(1);
        expect(result.errors).toStrictEqual([{message: '', reason: 'INVALID_SHIPPING_ADDRESS'}]);
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS and unsuccessful billingAddressResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        const data: Array<IApiSubrequestResponse> = [{status_code: 422, endpoint: '/addresses/billing', method: 'POST'}];
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, response: {data}}));

        const result = await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
        expect(result.errors?.length).toBe(1);
        expect(result.errors).toStrictEqual([{message: '', reason: 'INVALID_BILLING_ADDRESS'}]);
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS and no billing address', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: {
                total: {
                    amount: {
                        currency: 'CAD',
                        value: '29.99'
                    },
                    label: 'Total',
                },
                shippingAddress: MetaPaymentDetailsMock.shippingAddress,
            },
        }

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with OFFERS', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        await metaOnPaymentDetailsChanged(event)

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with OFFERS and unsuccessful deleteDiscountResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        // TODO make batch fail like deleteDiscountMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with OFFERS and unsuccessful addDiscountResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        // TODO make fail like addDiscountMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));
        batchRequestMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with valid FULFILLMENT_OPTION_ID', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['FULFILLMENT_OPTION_ID'],
            paymentDetails: {
                total: {
                    amount: {
                        currency: 'CAD',
                        value: '29.99'
                    },
                    label: 'Total',
                },
                shippingAddress: MetaPaymentDetailsMock.shippingAddress,
                fulfillmentOptionId: 'test_select_shipping_line_id'
            },
        }

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with valid FULFILLMENT_OPTION_ID and unsuccessful shippingLineResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['FULFILLMENT_OPTION_ID'],
            paymentDetails: {
                total: {
                    amount: {
                        currency: 'CAD',
                        value: '29.99'
                    },
                    label: 'Total',
                },
                shippingAddress: MetaPaymentDetailsMock.shippingAddress,
                fulfillmentOptionId: 'test_select_shipping_line_id'
            },
        }

        // TODO make batch fail like changeShippingLineMock.mockReturnValueOnce(Promise.resolve(baseReturnObject))
        batchRequestMock.mockReturnValueOnce(Promise.resolve(baseReturnObject))

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });

    it('metaOnPaymentDetailsChanged with invalid FULFILLMENT_OPTION_ID', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['FULFILLMENT_OPTION_ID'],
            paymentDetails: {
                total: {
                    amount: {
                        currency: 'CAD',
                        value: '29.99'
                    },
                    label: 'Total',
                },
                shippingAddress: MetaPaymentDetailsMock.shippingAddress,
                fulfillmentOptionId: 'invalid_shipping_line_id'
            },
        }

        await metaOnPaymentDetailsChanged(event);

        expect(batchRequestMock).toBeCalledTimes(1);
    });
})
