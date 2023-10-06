import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    FormControls,
    Payment,
    SummarySection,
    FlashError,
    Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    TaxExemption,
    ExternalPaymentGateway,
    HeaderLogo,
    Title,
    LifeFields
} from 'src/components';
import {
    useBeforeUnload,
    useOnLoadValidateCustomerAndShipping,
    useScrollToElementOnNavigation,
    useGetExternalPaymentGateways,
    useGetLifeFields,
    useOnLoadDefaultLifeFields,
    useGetLifeFieldsOnPage
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants, LifeInputLocationConstants, LifeInputPageConstants} from 'src/constants';

export function PaymentPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = usePaymentPage();
    const externalPaymentGateways = useGetExternalPaymentGateways(Constants.PAYMENT_METHOD_BELOW);
    const paymentGatewayLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_GATEWAY);
    const paymentGatewayAboveLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_METHOD_ABOVE);
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    useOnLoadValidateCustomerAndShipping();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.PAYMENT_THREE_PAGE));
    useEffect(() => {
        sendPageView('/payment', 3);
        sendEvents('Landed on payment page', {'category': 'Checkout'});
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title || ''}/>
            {mainContentBeginningLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>    
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-beginning-life-elements'} lifeFields={mainContentBeginningLifeFields}/>
                    </div>  
                </div> : null}
            <div className={'three-page'}>
                <Header isMobile={true}/>
                <div className='customer-section'>
                    <header className={'main-header'}>
                        {headerLogoUrl 
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs active={3}/>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <LifeFields className={'payment-method-above-life-elements'} lifeFields={paymentGatewayAboveLifeFields}/>
                            <Payment/>
                            {externalPaymentGateways.map((externalGateway) =>
                                <ExternalPaymentGateway
                                    position={Constants.PAYMENT_METHOD_BELOW}
                                    externalPaymentGateway={externalGateway}
                                    loadIframeImmediately={false}
                                    showTitle={false}
                                    key={externalGateway.public_id}
                                />
                            )}
                            <LifeFields className={'payment-gateway-life-elements'} lifeFields={paymentGatewayLifeFields}/>
                            <TaxExemption />
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonText={nextButtonText}
                                nextButtonTestDataId={'footer-complete-order-button'}
                            />
                        </form>
                    </main>
                    <Footer/>
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
