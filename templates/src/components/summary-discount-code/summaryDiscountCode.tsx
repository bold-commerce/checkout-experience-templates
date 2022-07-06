import React from 'react';
import {Button} from '@boldcommerce/stacks-ui';
import {useSummaryDiscountCode} from 'src/hooks';
import {FieldInput, SummaryDiscountLine, FlashError} from 'src/components';
import classNames from 'classnames';
import {IDiscount} from '@bold-commerce/checkout-frontend-library';

export function SummaryDiscountCode(): React.ReactElement {
    const {discounts, discountError, buttonLoading, buttonDisabled, addDiscount, updateNewDiscountCode, discountCodeText, discountCodeInputText} = useSummaryDiscountCode();

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
                <Button
                    data-testid='apply-discount'
                    loading={buttonLoading}
                    aria-disabled={buttonDisabled}
                    id={'add-discount-code-button'}
                    className={classNames(['btn-checkout', 'discount-code__button'])}
                    onClick={addDiscount}
                >
                    {'Apply'}
                </Button>
            </div>
            <FlashError type={'discountFlash'}/>
            <div className={'discount-code__list-discounts'}>
                {
                    discounts.map((discount: IDiscount) => {
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
