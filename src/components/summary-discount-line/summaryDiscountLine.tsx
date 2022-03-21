import React from 'react';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryDiscountLineProps} from 'src/types';
import {REMOVE_DISCOUNT} from 'src/action/appActionType';
import {useSummaryDiscountLine} from 'src/hooks';
import ClassNames from 'classnames';

export function SummaryDiscountLine(props: ISummaryDiscountLineProps): React.ReactElement {
    const {discountCloseLoading, deleteElementFromState, isLoading} = useSummaryDiscountLine();
    const notLoadingCloseDiscount = isLoading && !discountCloseLoading;

    return (
        <div className={'discount-code__discount-line'}>
            <div className={'discount-code__discount-code'}>
                <div className={ClassNames(['discount-code__discount-code-block', {'discount-code__disabled' : notLoadingCloseDiscount} ])}>
                    <div className={'discount-code__discount-code-value'}>{props.code}</div>
                    {!notLoadingCloseDiscount ?
                        discountCloseLoading ? <div className={'discount-code__spinner-div'}> <span className="discount-code__spinner"/> </div>
                            : <div data-testid='delete-discount' className={'discount-code__delete-discount-code'} onClick={() => deleteElementFromState(REMOVE_DISCOUNT, props.code)}/>
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
