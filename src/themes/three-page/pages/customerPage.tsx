import React, {useEffect} from 'react';
import {
    BillingAddress,
    Breadcrumbs,
    CustomerInformation,
    ShippingAddress,
    SummarySection,
    FormControls,
    FlashError,
    Header,
    ExpressPaymentGateway,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    ExternalPaymentGateway,
    HeaderLogo,
    Title
} from 'src/components';
import {useBeforeUnload, useScreenBreakpoints, useScrollToElementOnNavigation, useSendEvent, useGetExternalPaymentGateways, useIsUserAuthenticated} from 'src/hooks';
import {useCustomerPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants} from 'src/constants';
import {setDefaultAddresses} from 'src/library';
import {useDispatch} from 'react-redux';

export function CustomerPage(): React.ReactElement {
    const dispatch = useDispatch();
    const {isMobile} = useScreenBreakpoints();
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading, title} = useCustomerPage();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const externalPaymentGateways = useGetExternalPaymentGateways(Constants.CUSTOMER_INFO_ABOVE);
    const headerLogoUrl = window.headerLogoUrl;
    const isCustomerLoggedIn = useIsUserAuthenticated();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');

    if (window.initialTimestamps) {
        useEffect(() => {
            const sendInitialEvents = () => {
                useSendEvent(window.initialTimestamps);
            };
            window.addEventListener('load', sendInitialEvents);
            return () => document.removeEventListener('load', sendInitialEvents);
        }, []);
    }

    useEffect(() => {
        sendPageView('/customer_information', 1);
        sendEvents('Landed on customer information page', {'category': 'Checkout'});

        if (isCustomerLoggedIn) {
            dispatch(setDefaultAddresses);
        }
    }, []);


    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title || ''} />
            <div className={'three-page'}>
                <Header isMobile={true}/>
                {isMobile && <SummarySection orderCompleted={false}/>}
                <div className='customer-section' >
                    <header className={'main-header'}>
                        {headerLogoUrl 
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs active={active}/>
                        {externalPaymentGateways.map((externalGateway) =>
                            <ExternalPaymentGateway
                                externalPaymentGateway={externalGateway}
                                loadIframeImmediately={true}
                                showTitle={false}
                                key={externalGateway.public_id}
                                position={Constants.CUSTOMER_INFO_ABOVE}
                            />
                        )}
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <ExpressPaymentGateway/>
                            <CustomerInformation/>
                            <ShippingAddress/>
                            <BillingAddress/>
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonText={nextButtonText}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonTestDataId={'footer-continue-to-shipping-button'}
                            />
                        </form>
                    </main>
                    <Footer />
                </div>
                {!isMobile && <SummarySection orderCompleted={false}/>}
            </div>
        </div>
    );
}