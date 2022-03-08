import {
    IApplicationStateDiscount,
    IApplicationStateFee,
    IApplicationStateLineItem,
    IApplicationStatePayment,
    IApplicationStateSelectShippingLine,
    IApplicationStateTax,
    ITotals
} from 'src/types';

export function getTotals(
    line_items: Array<IApplicationStateLineItem>,
    payments: Array<IApplicationStatePayment>,
    taxes: Array<IApplicationStateTax>,
    discounts: Array<IApplicationStateDiscount>,
    shipping: IApplicationStateSelectShippingLine): ITotals {
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 0,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0,
        totalDiscounts: 0
    };

    totals.totalOrder = 0;
    // Products totals
    line_items.map((item: IApplicationStateLineItem) => {
        totals.totalSubtotal += item.product_data.quantity * item.product_data.price;
        item.fees.map((fee: IApplicationStateFee) => {
            totals.totalFees += fee.amount;
            totals.totalSubtotal += fee.amount;
        });
    });

    // Taxes
    taxes.map((item: IApplicationStateTax) => {
        totals.totalTaxes += item.value;
    });

    // Discounts
    discounts.map((item: IApplicationStateDiscount) => {
        totals.totalDiscounts += item.value;
    });

    // Payments
    payments.map((item: IApplicationStatePayment) => {
        totals.totalPaid += item.value;
    });

    totals.totalOrder = totals.totalSubtotal + shipping.amount + totals.totalTaxes - totals.totalDiscounts;

    totals.totalAmountDue = totals.totalOrder - totals.totalPaid;

    return totals;
}
