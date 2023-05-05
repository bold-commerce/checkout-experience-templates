import {defaultAddressState} from 'src/constants';
import {
    IApplicationState,
    ICustomer,
    IDiscount,
    ILineItem,
    IOrderMetaData,
    IPayment,
    IShippingLine,
    ITax
} from '@boldcommerce/checkout-frontend-library';

export function validateApplicationStateData(appData: IApplicationState): IApplicationState {
    const customer: ICustomer = appData.customer;
    let shippingAddress = appData.addresses.shipping;
    let billingAddress = appData.addresses.billing;
    const payments: Array<IPayment> = appData.payments;
    const discount: Array<IDiscount> = appData.discounts;
    const taxes: Array<ITax> = appData.taxes;
    const lineItems: Array<ILineItem> = appData.line_items;
    const availableShippingLines: Array<IShippingLine> = appData.shipping.available_shipping_lines;
    const metaData: IOrderMetaData = appData.order_meta_data;
    let fees = appData.fees;

    if(!shippingAddress || Object.keys(shippingAddress).length <=0){
        shippingAddress = defaultAddressState;
    }
    if(!billingAddress || Object.keys(billingAddress).length <=0){
        billingAddress = defaultAddressState;
    }
    let selectedShippingLines = appData.shipping.selected_shipping;
    if(!selectedShippingLines || Object.keys(selectedShippingLines).length <=0){
        selectedShippingLines = {
            id: '',
            description: '',
            amount: 0
        };
    }

    if(!fees){
        fees = [];
    }

    const applicationState : IApplicationState =
    {
        customer: customer,
        addresses: {
            shipping: shippingAddress,
            billing: billingAddress
        },
        payments: payments,
        discounts: discount,
        taxes: taxes,
        order_total: appData.order_total,
        resumable_link: appData.resumable_link,
        created_via: appData.created_via,
        is_processed: appData.is_processed,
        line_items: lineItems,
        currency: appData.currency,
        fees: fees,
        shipping: {
            selected_shipping: selectedShippingLines,
            available_shipping_lines: availableShippingLines,
            taxes: appData.shipping.taxes,
            discounts: appData.shipping.discounts
        },
        order_meta_data: metaData
    };

    return applicationState;

}
