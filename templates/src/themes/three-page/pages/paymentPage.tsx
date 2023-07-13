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
    useGetExternalPaymentGateways, useGetLifeFields
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants, LifeInputLocationConstants} from 'src/constants';

export function PaymentPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = usePaymentPage();
    const externalPaymentGateways = useGetExternalPaymentGateways(Constants.PAYMENT_METHOD_BELOW);
    const paymentGatewayLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYMENT_GATEWAY);
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    useOnLoadValidateCustomerAndShipping();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useEffect(() => {
        sendPageView('/payment', 3);
        sendEvents('Landed on payment page', {'category': 'Checkout'});
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title || ''}/>
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
                            <LifeFields lifeFields={paymentGatewayLifeFields}/>
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
        </div>
    );
}
