import { mocked } from 'jest-mock';
import { metaOnPaymentDetailsChanged } from 'src/themes/flow-sdk/meta';
import { callShippingAddressEndpoint, callBillingAddressEndpoint } from '@boldcommerce/checkout-express-pay-library';
import {
    changeShippingLine,
    getShipping,
    getShippingLines,
    setTaxes,
    baseReturnObject,
    getDiscounts,
    deleteDiscount,
    addDiscount
} from '@boldcommerce/checkout-frontend-library';
import { IMetaPaymentDetailsChangedEvent } from 'src/themes/flow-sdk/types';
import { MetaPaymentDetailsMock } from 'src/themes/flow-sdk/mocks/paymentMocks';
import {discountMock, shippingMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callShippingAddressEndpoint');
const callShippingAddressEndpointMock = mocked(callShippingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-express-pay-library/lib/utils/callBillingAddressEndpoint');
const callBillingAddressEndpointMock = mocked(callBillingAddressEndpoint, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/shipping');
const getShippingLinesMock = mocked(getShippingLines, true);
const changeShippingLineMock = mocked(changeShippingLine, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getShipping');
const getShippingMock = mocked(getShipping, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/discounts');
const deleteDiscountMock = mocked(deleteDiscount, true);
const addDiscountMock = mocked(addDiscount, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/state/getDiscounts');
const getDiscountsMock = mocked(getDiscounts, true);

jest.mock('@boldcommerce/checkout-frontend-library/lib/taxes');
const setTaxesMock = mocked(setTaxes, true);

describe('metaOnPaymentDetailsChanged', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getShippingMock.mockReturnValue(shippingMock);
        getDiscountsMock.mockReturnValue([discountMock]);
        callShippingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        callBillingAddressEndpointMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        changeShippingLineMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        deleteDiscountMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
        addDiscountMock.mockReturnValue(Promise.resolve({...baseReturnObject, success: true}));
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

        await metaOnPaymentDetailsChanged(event)

        expect(callShippingAddressEndpointMock).toBeCalledTimes(1)
        expect(getShippingLinesMock).toBeCalledTimes(1)
        expect(setTaxesMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with SHIPPING_ADDRESS and unsuccessful shippingAddressResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['SHIPPING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        callShippingAddressEndpointMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event)

        expect(callShippingAddressEndpointMock).toBeCalledTimes(1)
        expect(getShippingLinesMock).toBeCalledTimes(1)
        expect(setTaxesMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        await metaOnPaymentDetailsChanged(event)

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with BILLING_ADDRESS and unsuccessful billingAddressResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['BILLING_ADDRESS'],
            paymentDetails: MetaPaymentDetailsMock
        };

        callBillingAddressEndpointMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event)

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1)
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

        await metaOnPaymentDetailsChanged(event)

        expect(callBillingAddressEndpointMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with OFFERS', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        await metaOnPaymentDetailsChanged(event)

        expect(deleteDiscountMock).toBeCalledTimes(1)
        expect(addDiscountMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with OFFERS and unsuccessful deleteDiscountResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        deleteDiscountMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event)

        expect(deleteDiscountMock).toBeCalledTimes(1)
        expect(addDiscountMock).toBeCalledTimes(1)
    });

    it('metaOnPaymentDetailsChanged with OFFERS and unsuccessful addDiscountResponse', async () => {
        const event: IMetaPaymentDetailsChangedEvent = {
            changeTypes: ['OFFERS'],
            paymentDetails: MetaPaymentDetailsMock
        }

        addDiscountMock.mockReturnValueOnce(Promise.resolve({...baseReturnObject, success: false}));

        await metaOnPaymentDetailsChanged(event)

        expect(deleteDiscountMock).toBeCalledTimes(1)
        expect(addDiscountMock).toBeCalledTimes(1)
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

        await metaOnPaymentDetailsChanged(event)

        expect(changeShippingLineMock).toBeCalledTimes(1)
        expect(changeShippingLineMock).toBeCalledTimes(1)
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

        changeShippingLineMock.mockReturnValueOnce(Promise.resolve(baseReturnObject))

        await metaOnPaymentDetailsChanged(event)

        expect(changeShippingLineMock).toBeCalledTimes(1)
        expect(getShippingLinesMock).toBeCalledTimes(0)
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

        await metaOnPaymentDetailsChanged(event)

        expect(changeShippingLineMock).toBeCalledTimes(0)
        expect(getShippingLinesMock).toBeCalledTimes(0)
    });
})