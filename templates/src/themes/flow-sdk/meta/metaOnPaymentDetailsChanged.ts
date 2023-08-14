import {
    IMetaPaymentDetailsChangedEvent,
    IMetaPaymentDetailsUpdate,
} from 'src/themes/flow-sdk/types';
import {logger} from 'src/themes/flow-sdk/logger';
import {metaBuildPaymentDetails} from 'src/themes/flow-sdk/meta/metaBuildPaymentDetails';
import {callBillingAddressEndpoint, callShippingAddressEndpoint} from '@boldcommerce/checkout-express-pay-library';
import {formatCheckoutAddressFromMeta} from 'src/themes/flow-sdk/meta/formatCheckoutAddressFromMeta';
import {
    addDiscount,
    changeShippingLine,
    deleteDiscount,
    getDiscounts,
    getShipping,
    getShippingLines,
    setTaxes
} from '@boldcommerce/checkout-frontend-library';
import {API_RETRY} from 'src/constants';
import {
    META_BILLING_DATA_ERROR,
    META_FULFILLMENT_DATA_ERROR,
    META_OFFER_DATA_ERROR,
    META_SHIPPING_DATA_ERROR
} from 'src/themes/flow-sdk/constants';

export const metaOnPaymentDetailsChanged = async (event: IMetaPaymentDetailsChangedEvent): Promise<IMetaPaymentDetailsUpdate> => {
    logger({PaymentDetailsChangedEvent: {changeTypes: event.changeTypes}});
    const {shippingAddress, billingAddress, fulfillmentOptionId, offers} = event.paymentDetails;
    const paymentDetailsUpdate: IMetaPaymentDetailsUpdate = {paymentDetails: event.paymentDetails};

    // Update Order Shipping
    if (event.changeTypes.includes('SHIPPING_ADDRESS')) {
        const formattedShippingAddress = formatCheckoutAddressFromMeta(shippingAddress, true);
        const shippingAddressResponse = await callShippingAddressEndpoint(formattedShippingAddress, false);
        
        if (!shippingAddressResponse.success) {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_SHIPPING_DATA_ERROR);
        }
        await getShippingLines(API_RETRY);
        const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
        if (shippingLines.length > 0 && !selectedShipping) {
            await changeShippingLine(shippingLines[0].id, API_RETRY);
        }
        await setTaxes(API_RETRY);
    }

    // Update Order Billing
    if (event.changeTypes.includes('BILLING_ADDRESS')) {
        const metaBillingAddress = billingAddress ? billingAddress : shippingAddress;
        const formattedBillingAddress = formatCheckoutAddressFromMeta(metaBillingAddress, true);
        const billingAddressResponse = await callBillingAddressEndpoint(formattedBillingAddress, false);
        if (!billingAddressResponse.success) {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_BILLING_DATA_ERROR);
        }
    }

    // Update Order Discounts
    if (event.changeTypes.includes('OFFERS')) {
        if (offers && Array.isArray(offers)) {
            const discounts = getDiscounts();
            for (const discount of discounts) {
                const existentOffer = offers.find(o => o.code === discount.code);
                if (!existentOffer) {
                    const deleteDiscountResponse = await deleteDiscount(discount.code, API_RETRY);
                    if (!deleteDiscountResponse.success) {
                        if (paymentDetailsUpdate.errors === undefined) {
                            paymentDetailsUpdate.errors = [];
                        }
                        paymentDetailsUpdate.errors.push(META_OFFER_DATA_ERROR);
                    }
                }
            }

            for (const offer of offers) {
                const addDiscountResponse = await addDiscount(offer.code, API_RETRY);
                if (!addDiscountResponse.success) {
                    if (paymentDetailsUpdate.errors === undefined) {
                        paymentDetailsUpdate.errors = [];
                    }
                    paymentDetailsUpdate.errors.push(META_OFFER_DATA_ERROR);
                }
            }
        }
    }

    // Update Order Shipping option
    const {selected_shipping: selectedShipping, available_shipping_lines: shippingLines} = getShipping();
    if (event.changeTypes.includes('FULFILLMENT_OPTION_ID') || (!!fulfillmentOptionId && selectedShipping.id !== fulfillmentOptionId)) {
        const option = shippingLines.find(line => line.id === fulfillmentOptionId);
        if (option) {
            const shippingLineResponse = await changeShippingLine(option.id, API_RETRY);
            if (!shippingLineResponse.success) {
                if(paymentDetailsUpdate.errors === undefined){
                    paymentDetailsUpdate.errors = [];
                }
                paymentDetailsUpdate.errors.push(META_FULFILLMENT_DATA_ERROR);
            } else {
                await getShippingLines(API_RETRY);
            }
        } else {
            if(paymentDetailsUpdate.errors === undefined){
                paymentDetailsUpdate.errors = [];
            }
            paymentDetailsUpdate.errors.push(META_FULFILLMENT_DATA_ERROR);
        }
    }

    // Get Updated Order to paymentDetails
    paymentDetailsUpdate.paymentDetails = metaBuildPaymentDetails();
    logger({paymentDetailsUpdate});
    return paymentDetailsUpdate;
};
