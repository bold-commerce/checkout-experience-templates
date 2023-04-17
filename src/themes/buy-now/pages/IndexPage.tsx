import React, {ForwardedRef} from 'react';
import {useGetCurrencyInformation, useGetOverlayVisible} from 'src/hooks';
import {useFocusTrap, useGetCloseBuyNow, useIndexPage, useCheckShippingAddress} from 'src/themes/buy-now/hooks';
import {BillingAddressCheckbox, CartItems, CloseableHeader, CondensedSection, CondensedShipping, ExpandableDiscount, FlashError, Payment} from 'src/components';
import {Price} from '@boldcommerce/stacks-ui';
import {getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {IBuyNowContainerPageProps} from 'src/themes/buy-now/types';
import FocusTrap from 'focus-trap-react';

function IndexPage(props: IBuyNowContainerPageProps, ref: ForwardedRef<HTMLDivElement>): React.ReactElement {
    const {
        email,
        address,
        lineItems,
        loginText,
        orderTotal,
        quantityDisabled,
        summaryHeadingText,
        shippingHeadingText,
        paymentHeadingText,
        shippingIssueLinkText,
        shippingIssueText,
        checkoutOnClick,
        updateLineItemQuantity,
    } = useIndexPage();
    const {isValid: isShippingAddressValid} = useCheckShippingAddress();
    const {closeBuyNow, websiteName, loginUrl} = useGetCloseBuyNow();
    const {formattedPrice} = useGetCurrencyInformation();
    const subTotal = <Price amount={orderTotal} moneyFormatString={formattedPrice} />;
    const checkout = getTerm('complete_order', Constants.PAYMENT_INFO);
    const overlayVisible = useGetOverlayVisible();
    const customerSection = <>
        <p>{email}</p>
        <a onClick={loginUrl} href="#login">{loginText}</a>
    </>;
    const {focusTrapOptions} = useFocusTrap();

    return (
        <FocusTrap active={props.show && !overlayVisible} focusTrapOptions={focusTrapOptions}>
            <div ref={ref} className={`buy-now buy-now__index buy-now--${props.show ? 'open' : 'closed'}`}>
                <CloseableHeader className='buy-now__index-header' title={websiteName} onClose={closeBuyNow} />
                <FlashError />
                <div className='buy-now__products'>
                    <CartItems line_items={lineItems} onUpdateQuantity={updateLineItemQuantity} quantityDisabled={quantityDisabled} />
                </div>
                <CondensedSection {...{className: 'buy-now__summary buy-now__section', navigationHeadingProps: {text: summaryHeadingText, secondary: subTotal, navigation: () => props.navigateTo('/summary')}}} />
                <CondensedSection {...{className: 'buy-now__customer buy-now__section'}}>
                    {customerSection}
                </CondensedSection>
                <CondensedSection {...{className: 'buy-now__shipping buy-now__section', navigationHeadingProps: {text: shippingHeadingText, navigation: () => props.navigateTo('/shipping')}}} >
                    <CondensedShipping address={address} showMethod />
                    {!isShippingAddressValid && (
                        <div className="flash-error">
                            <div className="flash-error__container">
                                <span className="flash-error__text" aria-live="assertive">
                                    {shippingIssueText}{' '}
                                    <a
                                        onClick={() => props.navigateTo('/shipping')}
                                        children={shippingIssueLinkText}
                                    />
                                </span>
                            </div>
                        </div>
                    )}
                </CondensedSection>
                <CondensedSection {...{className: 'buy-now__payment buy-now__section', navigationHeadingProps: {text: paymentHeadingText, className: 'payment-heading'}}} >
                    <Payment showTitle={false} loadIframeImmediately={true} />
                    <ExpandableDiscount />
                    <BillingAddressCheckbox />
                </CondensedSection>
                <button className='buy-now__checkout-button' onClick={checkoutOnClick}>{checkout}</button>
            </div>
        </FocusTrap>
    );
}

export const IndexPageWrapper = React.forwardRef(IndexPage);
