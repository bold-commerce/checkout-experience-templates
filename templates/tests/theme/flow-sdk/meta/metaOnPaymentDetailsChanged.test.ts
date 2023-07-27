import { mocked } from 'jest-mock';
import { metaOnPaymentDetailsChanged } from 'src/themes/flow-sdk/meta';
import { callShippingAddressEndpoint, callBillingAddressEndpoint } from '@boldcommerce/checkout-express-pay-library';
import { changeShippingLine, getShipping, getShippingLines, setTaxes, baseReturnObject } from '@boldcommerce/checkout-frontend-library';
import { IMetaPaymentDetailsChangedEvent } from 'src/themes/flow-sdk/types';
import { MetaPaymentDetailsMock } from 'src/themes/flow-sdk/mocks/paymentMocks';
import { shippingMock } from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callShippingAddressEndpoint');
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callBillingAddressEndpoint');
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
const getShippingLinesMock = mocked(getShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
const getShippingMock = mocked(getShipping, true);


jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
const setTaxesMock = mocked(setTaxes, true);


describe('metaOnPaymentDetailsChanged', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('metaOnPaymentDetailsChanged no changeTypes', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
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
        }

        getShippingMock.mockReturnValue(shippingMock)

        await metaOnPaymentDetailsChanged(event)
    });

    it('metaOnPaymentDetailsChanged with SHIPPING_ADDRESS', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['SHIPPING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}))

        await metaOnPaymentDetailsChanged(event)

        expect(callShippingAddressEndpointMock).toBeCalledTimes(1)
        expect(getShippingLinesMock).toBeCalledTimes(1)
        expect(setTaxesMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}))

        await metaOnPaymentDetailsChanged(event)

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1)
    });


    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS with no billing address', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
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

        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}))

        await metaOnPaymentDetailsChanged(event)

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with FULFILLMENT_OPTION_ID', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
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

        getShippingMock.mockReturnValue(shippingMock)
        changeShippingLineMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}))

        await metaOnPaymentDetailsChanged(event)

        expect(changeShippingLineMock).toBeCalledTimes(1)
    });


    it('metaOnPaymentDetailsChanged with FULFILLMENT_OPTION_ID shippingLineResponse is an error', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
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

        getShippingMock.mockReturnValue(shippingMock)
        changeShippingLineMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}))

        await metaOnPaymentDetailsChanged(event)

        expect(changeShippingLineMock).toBeCalledTimes(1)
        expect(getShippingLinesMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with FULFILLMENT_OPTION_ID shippingLineResponse is an error', async () => {
        var event: IMetaPaymentDetailsChangedEvent = {
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

        getShippingMock.mockReturnValue(shippingMock)
        await metaOnPaymentDetailsChanged(event)
    });
})