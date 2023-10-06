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
    Title,
    LifeFields
} from 'src/components';
import {
    useBeforeUnload,
    useScreenBreakpoints,
    useScrollToElementOnNavigation,
    useSendEvent,
    useGetExternalPaymentGateways,
    useIsUserAuthenticated,
    useGetLifeFields,
    useGetRequiresShipping,
    useGetLifeFieldsOnPage,
    useOnLoadDefaultLifeFields
} from 'src/hooks';
import {useCustomerPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants, LifeInputLocationConstants, LifeInputPageConstants} from 'src/constants';
import {setDefaultAddresses} from 'src/library';
import {useDispatch} from 'react-redux';

export function CustomerPage(): React.ReactElement {
    const dispatch = useDispatch();
    const {isMobile} = useScreenBreakpoints();
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading, title} = useCustomerPage();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const externalPaymentGateways = useGetExternalPaymentGateways(Constants.CUSTOMER_INFO_ABOVE);
    const customerInfoLifeFields = useGetLifeFields(LifeInputLocationConstants.CUSTOMER_INFO);
    const shippingLifeFields = useGetLifeFields(LifeInputLocationConstants.SHIPPING);
    const billingAddressAfterLifeFields = useGetLifeFields(LifeInputLocationConstants.BILLING_ADDRESS_AFTER);
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const headerLogoUrl = window.headerLogoUrl;
    const isCustomerLoggedIn = useIsUserAuthenticated();
    const requiresShipping = useGetRequiresShipping();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.CUSTOMER_THREE_PAGE));

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
            {mainContentBeginningLifeFields.length > 0 ? 
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-beginning-life-elements'} lifeFields={mainContentBeginningLifeFields}/>
                    </div>
                </div> : null}
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
                            <LifeFields className={'customer-info-life-elements'} lifeFields={customerInfoLifeFields}/>
                            <ShippingAddress/>
                            <LifeFields className={'shipping-life-elements'} lifeFields={shippingLifeFields}/>
                            {requiresShipping ? <BillingAddress/> : null}
                            <LifeFields className={'billing-address-after-life-elements'} lifeFields={billingAddressAfterLifeFields}/>
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
            {mainContentEndLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-end-life-elements'} lifeFields={mainContentEndLifeFields}/>
                    </div> 
                </div> : null}
        </div>
    );
}
