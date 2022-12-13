import {
    useGetDiscounts,
    useGetFees,
    useGetLineItems,
    useGetOrderTotal,
    useGetPayments,
    useGetTaxes
} from 'src/hooks';
import {getTotals} from 'src/utils';
import {ITotals} from 'src/types';

export function getTotalsFromState(): ITotals {
    const discounts = useGetDiscounts();
    const payments = useGetPayments();
    const taxes = useGetTaxes();
    const fees = useGetFees();
    const lineItems = useGetLineItems();
    const orderTotal = useGetOrderTotal();
    return getTotals(lineItems, payments, taxes, fees, discounts, orderTotal);
}
