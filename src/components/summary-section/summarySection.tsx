import React from 'react';
import {SummaryTotals, SummaryDiscountCode, CartItems} from 'src/components';
import {ISummarySection} from 'src/types';
import {useCartSummary} from 'src/hooks';
import classNames from 'classnames';
import {Price} from '@boldcommerce/stacks-ui';

export function SummarySection (props: ISummarySection) : React.ReactElement {
    const {expandSummary, showSummary, toggleSummary, totals, lineItems, summaryAriaLabel} = useCartSummary();

    const classes = classNames([
        'summary__cart--expand',
        expandSummary ? 'block__summary-cart--collapse' : ''
    ]);

    return (
        <div className={'summary-section'}>
            <aside className={'summary'} data-testid={'CartSummary'} aria-label={summaryAriaLabel}>
                <button className={'summary__cart-icon'} onClick={toggleSummary} data-testid={'summary__cart-icon'}>
                    <span data-testid={'summary__cart--expand'} className={classes} >&nbsp;</span>
                </button>
                <div className={'summary__cart-title'} onClick={toggleSummary} data-testid={'summary__cart-total'}>
                    <h2 className={'cart-summary__title-content'} data-testid={'summary__cart-total-title'}>Summary</h2>
                    <Price amount={totals} className={'summary__cart-price'} data-testid={'summary__cart-total-price'}/>
                </div>
                {showSummary && <CartItems line_items={lineItems}/>}
                {showSummary && !props.orderCompleted && <SummaryDiscountCode />}
                {showSummary && <SummaryTotals orderCompleted={props.orderCompleted}/>}
            </aside>
        </div>

    );
}

