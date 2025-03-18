import {IOrderDataPayload, IRequirementDataType} from 'src/types';
import {getTotals} from 'src/utils';
import {getApplicationState} from '@boldcommerce/checkout-frontend-library';

export async function onRequireOrderData(requirements: Array<IRequirementDataType>):Promise<IOrderDataPayload> {
    const appState = getApplicationState();
    const totals = getTotals(appState.line_items, appState.payments, appState.taxes, appState.fees, appState.discounts, appState.order_total);

    const dataPayload: IOrderDataPayload = {};
    requirements.forEach(rq => {
        switch (rq) {
            case 'customer':
                dataPayload[rq] = {
                    first_name: appState.customer.first_name,
                    last_name: appState.customer.last_name,
                    email_address: appState.customer.email_address,
                };
                break;
            case 'items':
                dataPayload[rq] = appState.line_items.map(item => ({
                    amount: item.product_data.total_price,
                    label: item.product_data.product_title
                }));
                break;
            case 'billing_address':
                dataPayload[rq] = appState.addresses.billing;
                break;
            case 'shipping_address':
                dataPayload[rq] = appState.addresses.shipping;
                break;
            case 'shipping_options':
                dataPayload[rq] = appState.shipping.available_shipping_lines.map(o => ({
                    label: o.description,
                    amount: o.amount,
                    is_selected: appState.shipping.selected_shipping ? o.id === appState.shipping.selected_shipping.id : false,
                    id: o.id
                }));
                break;
            case 'totals':
                dataPayload[rq] = {
                    order_total: totals.totalOrder,
                    order_balance: totals.totalAmountDue,
                    shipping_total: appState.shipping?.selected_shipping?.amount || 0,
                    discounts_total: totals.totalDiscounts,
                    fees_total: totals.totalFees,
                    taxes_total: totals.totalTaxes,
                };
                break;
        }
    });

    return dataPayload;
}
