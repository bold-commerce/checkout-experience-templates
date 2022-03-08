import React from 'react';
import {Constants} from 'src/constants';
import {getTotals, getTerm} from 'src/utils';
import {SummaryLineExpandable, SummaryLineNonExpandable} from 'src/components';
import {REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action/appActionType';
import {useGetDiscounts, useGetLineItems, useGetPayments, useGetSelectShippingLine, useGetTaxes} from 'src/hooks';
import {ITaxesAmount} from 'src/types';

export function TaxesAmount(props: ITaxesAmount): React.ReactElement {
    const discounts = useGetDiscounts();
    const payments = useGetPayments();
    const taxes = useGetTaxes();
    const shipping = useGetSelectShippingLine();
    const lineItems = useGetLineItems();
    const totals = getTotals(lineItems, payments, taxes, discounts, shipping);

    const discountSection = <SummaryLineExpandable
        hasList
        hasDeleteButton={!props.orderCompleted}
        content={discounts}
        eventToggleName={Constants.DISCOUNTS_TOGGLE}
        total={totals.totalDiscounts}
        title={getTerm('discounts', Constants.SUMMARY_INFO)}
        eventDeleteName={REMOVE_DISCOUNT}
    />;

    const paymentSection = <SummaryLineExpandable
        hasBottom
        hasList
        hasDeleteButton={!props.orderCompleted}
        content={payments}
        eventToggleName={Constants.PAYMENTS_TOGGLE}
        total={totals.totalPaid}
        title={getTerm('payments', Constants.SUMMARY_INFO)}
        eventDeleteName={REMOVE_PAYMENT}
    />;

    const amountDueSection = <SummaryLineNonExpandable
        eventName={Constants.AMOUNT_DUE_EVENT}
        hasBottom
        name={getTerm('amount_remaining',Constants.SUMMARY_INFO)}
        total={totals.totalAmountDue}
    />;

    return (
        <div className={'taxes-amount'}>
            <SummaryLineNonExpandable
                eventName={Constants.SUBTOTAL_EVENT}
                name={getTerm('subtotal',Constants.SUMMARY_INFO)}
                total={totals.totalSubtotal}
            />

            <SummaryLineExpandable
                hasList
                content={[shipping]}
                eventToggleName={Constants.SHIPPING_TOGGLE}
                total={shipping.amount}
                title={getTerm('shipping',Constants.SUMMARY_INFO)}
            />

            {discounts && discounts.length > 0 && discountSection}

            <SummaryLineExpandable
                hasBottom
                hasList
                content={taxes}
                eventToggleName={Constants.TAXES_TOGGLE}
                total={totals.totalTaxes}
                title={getTerm('taxes',Constants.SUMMARY_INFO)}
            />

            <SummaryLineNonExpandable
                eventName={Constants.TOTAL_EVENT}
                hasBottom
                name={getTerm('total',Constants.SUMMARY_INFO)}
                total={totals.totalOrder}
            />

            {payments && payments.length > 0 && paymentSection}

            {payments && payments.length > 0 && amountDueSection}
        </div>
    );
}
