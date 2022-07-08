import {ITotals} from 'src/types';
import {
    IDiscount,
    IFee,
    IFees,
    ILineItem,
    IPayment,
    IShippingLine,
    ITax
} from '@bold-commerce/checkout-frontend-library';


export function getTotals(
    line_items: Array<ILineItem>,
    payments: Array<IPayment>,
    taxes: Array<ITax>,
    fees: Array<IFees> | undefined,
    discounts: Array<IDiscount>,
    shipping: IShippingLine): ITotals {
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 0,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalTaxes: 0,
        totalDiscounts: 0,
        totalAdditionalFees: 0
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
        const valueToSum = item.value && item.amount ? item.value : item.amount; // TODO: use item.amount after FF CE-539-Add-PaymentLine-Model is Enabled by default
        totals.totalPaid += valueToSum;
    });

    //additional fees
    fees && fees.map((item: IFees) => {
        totals.totalAdditionalFees += item.value;
    });

    totals.totalOrder = totals.totalSubtotal + shipping.amount + totals.totalTaxes + totals.totalAdditionalFees - totals.totalDiscounts;

    totals.totalAmountDue = totals.totalOrder - totals.totalPaid;

    return totals;
}
