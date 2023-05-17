import {IAddressType, ICustomer, IDiscount, ILineItem, IShippingLine} from '@boldcommerce/checkout-frontend-library';
import {ITotals} from 'src/types';

export function orderCompleteForGoogleTagManager(customer:ICustomer, addresses: IAddressType, lineItems: Array<ILineItem>, currency: string, totals: ITotals, shipping: IShippingLine, id: string, discounts: Array<IDiscount>): void {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        event: 'bold_order_complete',
        customer: {
            email: customer.email_address,
        },
        shipping_address: {
            province_code: addresses.shipping.province_code,
            country_code: addresses.shipping.country_code,
        },
        billing_address: {
            province_code: addresses.shipping.province_code,
            country_code: addresses.shipping.country_code,
        },
        line_items: lineItems,
        currency,
        totals,
        shipping,
        discounts,
        id,
    });
}
