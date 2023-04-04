import {
    BillingAddress,
    CustomerInformation,
    ExpressPaymentGateway,
    FlashError, Footer, FormControls,
    Header,
    HeaderHelmet,
    Payment,
    ShippingAddress,
    ShippingLines,
    SummarySection,
    TaxExemption
} from 'src/components';
import React, { useEffect } from 'react';
import {getCheckoutUrl, getTerm, withPreventDefault} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {checkInventoryStage} from '@bold-commerce/checkout-frontend-library';
import { useDispatch } from 'react-redux';
import { checkInventory } from 'src/library';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    const {nextButtonOnClick, ...footerProps} = useGetOnePageFooterData();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const dispatch = useDispatch();
    useEffect(() => { dispatch(checkInventory(checkInventoryStage.initial)); }, []);

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <HeaderHelmet title={footerProps.title}/>
            <div className={'customer-section'}>
                <Header isMobile={false}/>
                <main aria-label={mainAriaLabel}>
                    <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                        <FlashError/>
                        <ExpressPaymentGateway/>
                        <CustomerInformation/>
                        <ShippingAddress/>
                        <BillingAddress/>
                        <ShippingLines/>
                        <Payment loadIframeImmediately={true} />
                        <TaxExemption />
                        <FormControls {...footerProps}/>
                    </form>
                </main>
                <Footer />
            </div>
            <SummarySection orderCompleted={false}/>
        </div>
    );
}
