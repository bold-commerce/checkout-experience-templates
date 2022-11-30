import {Price} from '@boldcommerce/stacks-ui';
import ClassNames from 'classnames';
import React from 'react';

import {REMOVE_DISCOUNT} from 'src/action/appActionType';
import {Constants} from 'src/constants';
import {useSummaryDiscountLine} from 'src/hooks';
import {ISummaryDiscountLineProps} from 'src/types';
import {getTerm} from 'src/utils';

export function SummaryDiscountLine(props: ISummaryDiscountLineProps): React.ReactElement {
    const {discountCloseLoading, deleteElementFromState, isLoading} = useSummaryDiscountLine();
    const notLoadingCloseDiscount = isLoading && !discountCloseLoading;
    const appliedDiscount = getTerm('applied_discount', Constants.SUMMARY_INFO);
    const deleteDiscount = getTerm('delete_discount', Constants.SUMMARY_INFO);

    return (
        <div className={'discount-code__discount-line'}>
            <div className={'discount-code__discount-code'} aria-label={`${appliedDiscount}: ${props.code}`}>
                <div className={ClassNames(['discount-code__discount-code-block', {'discount-code__disabled' : notLoadingCloseDiscount} ])}>
                    <div className={'discount-code__discount-code-value'}>{props.code}</div>
                    {!notLoadingCloseDiscount ?
                        discountCloseLoading ? <div className={'discount-code__spinner-div'}> <span className="discount-code__spinner"/> </div>
                            : <button data-testid='delete-discount' className={'discount-code__delete-discount-code'} onClick={() => deleteElementFromState(REMOVE_DISCOUNT, props.code)} aria-label={`${deleteDiscount} ${props.code}`} />
                        : null
                    }
                </div>
            </div>
            <div className={'discount-code__discount-code-price'}>
                <Price className={'discount_code--price'} amount={-props.amount}/>
            </div>
        </div>
    );
}
