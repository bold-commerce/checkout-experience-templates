import React from 'react';
import {Button} from '@boldcommerce/stacks-ui';
import {useGetIsLoading, useSummaryDiscountCode} from 'src/hooks';
import {FieldInput, SummaryDiscountLine} from 'src/components';
import {IApplicationStateDiscount} from 'src/types';
import classNames from 'classnames';

export function SummaryDiscountCode(): React.ReactElement {
    const {discounts, discountError, buttonLoading, buttonDisabled, addDiscount, updateNewDiscountCode, discountCodeText, discountCodeInputText} = useSummaryDiscountCode();
    const isLoading = useGetIsLoading();

    return (
        <div className={classNames(['discount-code', 'discount-code--border-bottom'])}>
            <div className={'discount-code-input'}>
                <FieldInput placeholder={discountCodeInputText}
                    className={'discount-code__input-field'}
                    name={'discount-code'}
                    value={discountCodeText}
                    handleChange={updateNewDiscountCode}
                    id={'add-discount-code-field-input'}
                    errorMessage={discountError}
                    autoFocus={true}/>
                <Button data-testid='apply-discount' loading={buttonLoading} disabled={buttonLoading || buttonDisabled || isLoading} className={classNames(['btn-checkout', 'discount-code__button'])} onClick={() => addDiscount()}>{'Apply'}</Button>
            </div>
            <div className={'discount-code__list-discounts'}>
                {
                    discounts.map((discount: IApplicationStateDiscount) => {
                        return (
                            <SummaryDiscountLine
                                key={`discount-line-${discount.code}`}
                                code={discount.code}
                                amount={discount.value}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
}
