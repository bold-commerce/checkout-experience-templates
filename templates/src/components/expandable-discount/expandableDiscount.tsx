import React from 'react';
import {useExpandableDiscount} from 'src/hooks/useExpandableDiscount';
import {SummaryDiscountCode} from 'src/components';
import classNames from 'classnames';

export function ExpandableDiscount(): React.ReactElement {
    const {expandDiscount, toggleDiscount, discountCodeInputText} = useExpandableDiscount();

    return (
        <div className={classNames(['expandable-discount'])}>
            <a 
                className={classNames(['expandable-discount__toggle', expandDiscount && 'expandable-discount__toggle--open'])} 
                data-testid='discount-toggle' 
                onClick={toggleDiscount} 
                href="#discount"
            >
                {discountCodeInputText}
            </a>

            {expandDiscount && <SummaryDiscountCode />}
        </div>
    );
}
