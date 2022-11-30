import React from 'react';
import {useExpandableDiscount} from 'src/hooks/useExpandableDiscount';
import {SummaryDiscountCode} from 'src/components';
import classNames from 'classnames';

export function ExpandableDiscount(): React.ReactElement {
    const {expandDiscount, toggleDiscount, discountCodeInputText} = useExpandableDiscount();

    return (
        <div className={classNames(['expandable-discount'])}>
            {!expandDiscount ? 
                <a className={classNames(['expandable-discount__toggle'])} data-testid='discount-toggle' onClick={toggleDiscount} href="#discount">{discountCodeInputText}</a> :
                <SummaryDiscountCode />
            }
        </div>
    );
}
