import React, { ForwardedRef } from 'react';
import ClassNames from 'classnames';
import { useGetCurrencyInformation } from 'src/hooks';
import { useGetCloseBuyNow, useIndexPage } from 'src/themes/buy-now/hooks';
import { BillingAddressCheckbox, CartItems, CloseableHeader, CondensedSection, CondensedShipping, ExpandableDiscount, FlashError, Payment } from 'src/components';
import { Price } from '@boldcommerce/stacks-ui';
import { getTerm } from 'src/utils';
import { Constants } from 'src/constants';
import { IBuyNowContainerPageProps } from 'src/themes/buy-now/types';

function IndexPage(props: IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const {
        email,
        address,
        lineItems,
        loginText,
        orderTotal,
        websiteName,
        quantityDisabled,
        summaryHeadingText,
        shippingHeadingText,
        paymentHeadingText,
        loginUrl,
        checkoutOnClick,
        updateLineItemQuantity,
    } = useIndexPage();
    const closeBuyNow = useGetCloseBuyNow();
    const { formattedPrice } = useGetCurrencyInformation();
    const login = <a onClick={loginUrl}>{loginText}</a>;
    const subTotal = <Price amount={orderTotal} moneyFormatString={formattedPrice}/>;
    const checkout = getTerm('complete_order', Constants.PAYMENT_INFO);

    return (
        <div ref={ref} className={ClassNames('buy-now', props.show ? 'buy-now--open' : 'buy-now--closed')}>
            <CloseableHeader className='buy-now__index-header' title={websiteName} onClose={closeBuyNow} />
            <FlashError />
            <div className='buy-now__products'>
                <CartItems line_items={lineItems} onUpdateQuantity={updateLineItemQuantity} quantityDisabled={quantityDisabled} />
            </div>
            <CondensedSection {...{ className: ClassNames(['buy-now__summary', 'buy-now__section']), navigationHeadingProps: { text: summaryHeadingText, secondary: subTotal, navigation: () => props.navigateTo('/summary') } }} />
            <CondensedSection {...{ className: ClassNames(['buy-now__customer', 'buy-now__section']), navigationHeadingProps: { text: email, secondary: login} }} />
            <CondensedSection {...{ className: ClassNames(['buy-now__shipping', 'buy-now__section']), navigationHeadingProps: { text: shippingHeadingText, navigation: () => props.navigateTo('/shipping') } }} >
                <CondensedShipping address={ address } showMethod />
            </CondensedSection>
            <CondensedSection {...{ className: ClassNames(['but-now__payment', 'buy-now__section']), navigationHeadingProps: { text: paymentHeadingText, className: 'payment-heading' } }} >
                <Payment showTitle={false}/>
                <ExpandableDiscount />
                <BillingAddressCheckbox />
            </CondensedSection>
            <button className='buy-now__checkout-button' onClick={checkoutOnClick}>{checkout}</button>
        </div>
    );
}

export const IndexPageWrapper = React.forwardRef(IndexPage);
