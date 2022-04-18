import {
    IApplicationState,
    IApplicationStateCustomer,
    IApplicationStateDiscount,
    IApplicationStateLineItem,
    IApplicationStateOrderMetaData,
    IApplicationStatePayment,
    IApplicationStateSelectShippingLine,
    IApplicationStateTax
} from 'src/types';
import {defaultAddressState} from 'src/constants';

export function validateApplicationStateData(appData: IApplicationState): IApplicationState {
    const customer: IApplicationStateCustomer = appData.customer;
    let shippingAddress = appData.addresses.shipping;
    let billingAddress = appData.addresses.billing;
    const payments: Array<IApplicationStatePayment> = appData.payments;
    const discount: Array<IApplicationStateDiscount> = appData.discounts;
    const taxes: Array<IApplicationStateTax> = appData.taxes;
    const lineItems: Array<IApplicationStateLineItem> = appData.line_items;
    const availableShippingLines: Array<IApplicationStateSelectShippingLine> = appData.shipping.available_shipping_lines;
    const metaData: IApplicationStateOrderMetaData = appData.order_meta_data;

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
