import {ITotals} from 'src/types';
import {IDiscount, IFee, ILineItem, IPayment, IShippingLine, ITax} from '@bold-commerce/checkout-frontend-library';


export function getTotals(
    line_items: Array<ILineItem>,
    payments: Array<IPayment>,
    taxes: Array<ITax>,
    discounts: Array<IDiscount>,
    shipping: IShippingLine): ITotals {
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
    line_items.map((item: ILineItem) => {
        totals.totalSubtotal += item.product_data.quantity * item.product_data.price;
        item.fees.map((fee: IFee) => {
            totals.totalFees += fee.amount;
            totals.totalSubtotal += fee.amount;
        });
    });

    // Taxes
    taxes.map((item: ITax) => {
        totals.totalTaxes += item.value;
    });

    // Discounts
    discounts.map((item: IDiscount) => {
        totals.totalDiscounts += item.value;
    });

    // Payments
    payments.map((item: IPayment) => {
        totals.totalPaid += item.value ?? (item.amount * 100);
    });

    totals.totalOrder = totals.totalSubtotal + shipping.amount + totals.totalTaxes - totals.totalDiscounts;

    totals.totalAmountDue = totals.totalOrder - totals.totalPaid;

    return totals;
}
