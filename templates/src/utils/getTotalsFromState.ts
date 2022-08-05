import {
    useGetDiscounts,
    useGetFees,
    useGetLineItems,
    useGetPayments,
    useGetSelectShippingLine,
    useGetTaxes
} from 'src/hooks';
import {getTotals} from 'src/utils';
import {ITotals} from 'src/types';

export function getTotalsFromState(): ITotals {
    const discounts = useGetDiscounts();
    const payments = useGetPayments();
    const taxes = useGetTaxes();
    const fees = useGetFees();
    const shipping = useGetSelectShippingLine();
    const lineItems = useGetLineItems();
    return getTotals(lineItems, payments, taxes, fees, discounts, shipping);
}
