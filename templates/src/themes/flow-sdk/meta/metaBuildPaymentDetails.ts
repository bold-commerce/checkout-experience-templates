import {IMetaPaymentDetails, IMetaPaymentItem, IMetaSummaryPaymentItem} from 'src/themes/flow-sdk/types';
import {
    getBillingAddress,
    getCurrency,
    getDiscounts,
    getLineItems,
    getShipping,
    getShippingAddress
} from '@boldcommerce/checkout-frontend-library';
import {getTotals, getValueByCurrency} from '@boldcommerce/checkout-express-pay-library';
import {formatMetaAddressFromCheckout} from 'src/themes/flow-sdk/meta/formatMetaAddressFromCheckout';

export const metaBuildPaymentDetails = (): IMetaPaymentDetails => {
    const {iso_code: currencyCode} = getCurrency();
    const {totalAmountDue, totalFees, totalTaxes, totalDiscounts, totalSubtotal} = getTotals();
    const {available_shipping_lines: shippingOptions, selected_shipping: selectedShippingOption} = getShipping();
    const shippingAddress = getShippingAddress();
    const billingAddress = getBillingAddress();
    const lineItems = getLineItems();
    const discounts = getDiscounts();

    const paymentDetails: IMetaPaymentDetails = {
        total: {amount: {currency: currencyCode, value: getValueByCurrency(totalAmountDue, currencyCode)}, label: 'Total'},
        shippingAddress: formatMetaAddressFromCheckout(shippingAddress),
        billingAddress: formatMetaAddressFromCheckout(billingAddress),
    };

    if (shippingOptions.length > 0) {
        paymentDetails.fulfillmentOptions = shippingOptions.map(option => ({
            id: option.id,
            label: option.description,
            amount: {currency: currencyCode, value: getValueByCurrency(option.amount, currencyCode)},
        }));
    }

    const summaryItems: Array<IMetaSummaryPaymentItem> = [];
    if (totalSubtotal > 0) {
        summaryItems.push({
            amount: {currency: currencyCode, value: getValueByCurrency(totalSubtotal, currencyCode)},
            summaryItemType: 'SUBTOTAL',
            label: 'Subtotal'
        });
    }

    if (totalFees > 0) {
        summaryItems.push({
            amount: {currency: currencyCode, value: getValueByCurrency(totalFees, currencyCode)},
            summaryItemType: 'FEE',
            label: 'Fees'
        });
    }

    if (totalTaxes > 0) {
        summaryItems.push({
            amount: {currency: currencyCode, value: getValueByCurrency(totalTaxes, currencyCode)},
            summaryItemType: 'ESTIMATED_TAX',
            label: 'Taxes'
        });
    }

    if (totalDiscounts > 0) {
        summaryItems.push({
            amount: {currency: currencyCode, value: getValueByCurrency(-totalDiscounts, currencyCode)},
            summaryItemType: 'OFFER',
            label: 'Discounts'
        });
    }

    if (discounts.length > 0) {
        paymentDetails.offers = discounts.map(discount => ({
            code: discount.code,
            label: discount.text
        }));
    } else {
        paymentDetails.offers = [];
    }

    if (selectedShippingOption) {
        if (selectedShippingOption.amount > 0) {
            summaryItems.push({
                amount: {currency: currencyCode, value: getValueByCurrency(selectedShippingOption.amount, currencyCode)},
                summaryItemType: 'FULFILLMENT',
                label: 'Shipping'
            });
        }
        paymentDetails.fulfillmentOptionId = selectedShippingOption.id;
    }

    if (summaryItems.length > 0) {
        paymentDetails.summaryItems = summaryItems;
    }

    const displayItems: Array<IMetaPaymentItem> = [];
    if (lineItems.length > 0) {
        lineItems.forEach(item => {
            // This is a Hacky way to handle html entities into Product Title
            // We add the title to an element and extract its value that will be decoded by the element
            const el = document.createElement('textarea');
            el.innerHTML = item.product_data.product_title;

            displayItems.push({
                amount: {currency: currencyCode, value: getValueByCurrency(item.product_data.price, currencyCode)},
                label: el.value,
                quantity: item.product_data.quantity,
                imageURI: item.product_data.image_url,
            });
        });
        paymentDetails.displayItems = displayItems;
    }

    return paymentDetails;
};
