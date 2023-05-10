import {ITotals} from 'src/types';
import {
    IDiscount,
    IFee,
    IFees,
    ILineItem,
    IPayment,
    ITax
} from '@boldcommerce/checkout-frontend-library';


export function getTotals(
    line_items: Array<ILineItem>,
    payments: Array<IPayment>,
    taxes: Array<ITax>,
    fees: Array<IFees> | undefined,
    discounts: Array<IDiscount>,
    total: number,
): ITotals {
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: total,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0,
        totalDiscounts: 0,
        totalAdditionalFees: 0
    };

    // Products totals
    line_items.forEach((item: ILineItem) => {
        totals.totalSubtotal += item.product_data.quantity * item.product_data.price;
        item.fees.forEach((fee: IFee) => {
            totals.totalFees += fee.amount;
            totals.totalSubtotal += fee.amount;
        });
    });

    // Taxes
    taxes.forEach((item: ITax) => {
        totals.totalTaxes += item.value;
    });

    // Discounts
    discounts.forEach((item: IDiscount) => {
        totals.totalDiscounts += item.value;
    });

    // Payments
    payments.forEach((item: IPayment) => {
        const valueToSum = item.value && item.amount ? item.value : item.amount; // TODO: use item.amount after FF CE-539-Add-PaymentLine-Model is Enabled by default
        totals.totalPaid += valueToSum;
    });

    //additional fees
    fees && fees.forEach((item: IFees) => {
        totals.totalAdditionalFees += item.value;
    });

    totals.totalAmountDue = totals.totalOrder - totals.totalPaid;

    return totals;
}
