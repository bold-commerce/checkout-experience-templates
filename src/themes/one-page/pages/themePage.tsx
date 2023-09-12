import {
    BillingAddress,
    CustomerInformation,
    ExpressPaymentGateway, ExternalPaymentGateway,
    FlashError, Footer, FormControls,
    Header,
    HeaderHelmet,
    LifeFields,
    Payment,
    ShippingAddress,
    ShippingLines,
    SummarySection,
    TaxExemption
} from 'src/components';
import React, {useEffect} from 'react';
import {getCheckoutUrl, getTerm, withPreventDefault} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {checkInventoryStage} from '@boldcommerce/checkout-frontend-library';
import {useDispatch} from 'react-redux';
import {checkInventory, setDefaultAddresses} from 'src/library';
import {
    useGetExternalPaymentGateways,
    useIsUserAuthenticated,
    useGetLifeFields,
    useGetRequiresShipping
} from 'src/hooks';
import {LifeInputLocationConstants} from 'src/constants';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    const {nextButtonOnClick, ...footerProps} = useGetOnePageFooterData();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const infoExternalPaymentGateways = useGetExternalPaymentGateways(Constants.CUSTOMER_INFO_ABOVE);
    const paymentExternalPaymentGateways = useGetExternalPaymentGateways(Constants.PAYMENT_METHOD_BELOW);
    const dispatch = useDispatch();
    const isCustomerLoggedIn = useIsUserAuthenticated();
    const requiresShipping = useGetRequiresShipping();

    const customerInfoLifeFields = useGetLifeFields(LifeInputLocationConstants.CUSTOMER_INFO);
    const shippingLifeFields = useGetLifeFields(LifeInputLocationConstants.SHIPPING);
    const billingAddressAfterLifeFields = useGetLifeFields(LifeInputLocationConstants.BILLING_ADDRESS_AFTER);
    const shippingLinesLifeFields  = useGetLifeFields(LifeInputLocationConstants.SHIPPING_LINES);
    const paymentGatewayAboveLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_METHOD_ABOVE);
    const paymentGatewayLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_GATEWAY);
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);


    useEffect(() => {
        dispatch(checkInventory(checkInventoryStage.initial)); 
        
        if (isCustomerLoggedIn) {
            dispatch(setDefaultAddresses);
        }
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <HeaderHelmet title={footerProps.title}/>
            {mainContentBeginningLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields lifeFields={mainContentBeginningLifeFields}/>
                    </div>
                </div> : null}
            <div className={'one-page'}>
                <div className={'customer-section one-page'}>
                    <Header isMobile={false}/>
                    <main aria-label={mainAriaLabel}>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <ExpressPaymentGateway/>
                            {infoExternalPaymentGateways.map((externalGateway) =>
                                <ExternalPaymentGateway
                                    externalPaymentGateway={externalGateway}
                                    loadIframeImmediately={true}
                                    showTitle={false}
                                    key={externalGateway.public_id}
                                    position={Constants.CUSTOMER_INFO_ABOVE}
                                />
                            )}
                            <CustomerInformation/>
                            <LifeFields lifeFields={customerInfoLifeFields}/>
                            <ShippingAddress/>
                            <LifeFields lifeFields={shippingLifeFields}/>
                            {requiresShipping ? <BillingAddress/> : null}
                            <LifeFields lifeFields={billingAddressAfterLifeFields}/>
                            <ShippingLines/>
                            <LifeFields lifeFields={shippingLinesLifeFields}/>
                            <LifeFields lifeFields={paymentGatewayAboveLifeFields}/>
                            <Payment loadIframeImmediately={true} />
                            {paymentExternalPaymentGateways.map((externalGateway) =>
                                <ExternalPaymentGateway
                                    externalPaymentGateway={externalGateway}
                                    loadIframeImmediately={false}
                                    showTitle={false}
                                    key={externalGateway.public_id}
                                    position={Constants.PAYMENT_METHOD_BELOW}
                                />
                            )}
                            <LifeFields lifeFields={paymentGatewayLifeFields}/>
                            <TaxExemption />
                            <FormControls {...footerProps}/>
                        </form>
                    </main>
                    <Footer />
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
            {mainContentEndLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields lifeFields={mainContentEndLifeFields}/>
                    </div>
                </div> : null}
        </div>
    );
}
