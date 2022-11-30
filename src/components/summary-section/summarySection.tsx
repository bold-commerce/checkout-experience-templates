import React from 'react';
import {TaxesAmount, SummaryDiscountCode, CartItems} from 'src/components';
import {ISummarySection} from 'src/types';
import {useCartSummary} from 'src/hooks';
import classNames from 'classnames';
import {Price} from '@boldcommerce/stacks-ui';

export function SummarySection (props: ISummarySection) : React.ReactElement {
    const {expandSummary, showSummary, toggleSummary, totals, lineItems} = useCartSummary();

    const classes = classNames([
        'summary__cart--expand',
        expandSummary ? 'block__summary-cart--collapse' : ''
    ]);

    return (
        <div className={'summary-section'}>
            <div className={'summary'} data-testid={'CartSummary'}>
                <button className={'summary__cart-icon'} onClick={toggleSummary}>
                    <span data-testid={'summary__cart--expand'} className={classes} >&nbsp;</span>
                </button>
                <div className={'summary__cart-title'} onClick={toggleSummary}>
                    <span className={'cart-summary__title-content'}>Summary</span>
                    <Price amount={totals} className={'summary__cart-price'} />
                </div>
                {showSummary && <CartItems line_items={lineItems}/>}
                {showSummary && !props.orderCompleted && <SummaryDiscountCode />}
                {showSummary && <TaxesAmount orderCompleted={props.orderCompleted}/>}
            </div>
        </div>

    );
}

