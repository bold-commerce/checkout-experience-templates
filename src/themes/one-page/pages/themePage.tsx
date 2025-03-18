import {
    BillingAddress,
    CustomerInformation,
    EpsExpressPaymentGateway,
    ExpressPaymentGateway,
    ExternalPaymentGateway,
    FlashError,
    Footer,
    FormControls,
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
import {Constants, LifeInputPageConstants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {checkInventoryStage} from '@boldcommerce/checkout-frontend-library';
import {useDispatch} from 'react-redux';
import {checkInventory, setDefaultAddresses} from 'src/library';
import {
    useGetExternalPaymentGateways,
    useIsUserAuthenticated,
    useGetLifeFields,
    useGetRequiresShipping,
    useOnLoadDefaultLifeFields,
    useGetLifeFieldsOnPage,
    useGetIsOrderProcessed,
    useGetEpsGateways
} from 'src/hooks';
import {LifeInputLocationConstants} from 'src/constants';
import {useHistory} from 'react-router';
import {actionSetOnePageTheme} from 'src/action';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE));
    const {nextButtonOnClick, ...footerProps} = useGetOnePageFooterData();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const infoExternalPaymentGateways = useGetExternalPaymentGateways(Constants.CUSTOMER_INFO_ABOVE);
    const paymentExternalPaymentGateways = useGetExternalPaymentGateways(Constants.PAYMENT_METHOD_BELOW);
    const dispatch = useDispatch();
    const isCustomerLoggedIn = useIsUserAuthenticated();
    const requiresShipping = useGetRequiresShipping();
    const history = useHistory();
    const isOrderCompleted = useGetIsOrderProcessed();
    const isGatewayEps = useGetEpsGateways();

    const customerInfoLifeFields = useGetLifeFields(LifeInputLocationConstants.CUSTOMER_INFO);
    const shippingLifeFields = useGetLifeFields(LifeInputLocationConstants.SHIPPING);
    const billingAddressAfterLifeFields = useGetLifeFields(LifeInputLocationConstants.BILLING_ADDRESS_AFTER);
    const shippingLinesLifeFields  = useGetLifeFields(LifeInputLocationConstants.SHIPPING_LINES);
    const paymentGatewayAboveLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_METHOD_ABOVE);
    const paymentGatewayLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_GATEWAY);
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);


    useEffect(() => {
        dispatch(actionSetOnePageTheme(true));
        dispatch(checkInventory(checkInventoryStage.initial));

        if (isCustomerLoggedIn) {
            dispatch(setDefaultAddresses);
        }

        if (isOrderCompleted) {
            history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
        }
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <HeaderHelmet title={footerProps.title}/>
            {mainContentBeginningLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-beginning-life-elements'} lifeFields={mainContentBeginningLifeFields}/>
                    </div>
                </div> : null}
            <div className={'one-page'}>
                <div className={'customer-section'}>
                    <Header isMobile={false}/>
                    <main aria-label={mainAriaLabel}>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            {isGatewayEps ? <EpsExpressPaymentGateway/>: <ExpressPaymentGateway/>}
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
                            <LifeFields className={'customer-info-life-elements'} lifeFields={customerInfoLifeFields}/>
                            <ShippingAddress/>
                            <LifeFields className={'shipping-life-elements'} lifeFields={shippingLifeFields}/>
                            {requiresShipping ? <BillingAddress/> : null}
                            <LifeFields className={'billing-address-after-life-elements'} lifeFields={billingAddressAfterLifeFields}/>
                            <ShippingLines theme={Constants.ONE_PAGE}/>
                            <LifeFields className={'shipping-lines-life-elements'} lifeFields={shippingLinesLifeFields}/>
                            <LifeFields className={'payment-method-above-life-elements'} lifeFields={paymentGatewayAboveLifeFields}/>
                            <Payment loadIframeImmediately={false} />
                            {paymentExternalPaymentGateways.map((externalGateway) =>
                                <ExternalPaymentGateway
                                    externalPaymentGateway={externalGateway}
                                    loadIframeImmediately={false}
                                    showTitle={false}
                                    key={externalGateway.public_id}
                                    position={Constants.PAYMENT_METHOD_BELOW}
                                />
                            )}
                            <LifeFields className={'payment-gateway-life-elements'} lifeFields={paymentGatewayLifeFields}/>
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
                        <LifeFields className={'main-content-end-life-elements'} lifeFields={mainContentEndLifeFields}/>
                    </div>
                </div> : null}
        </div>
    );
}
