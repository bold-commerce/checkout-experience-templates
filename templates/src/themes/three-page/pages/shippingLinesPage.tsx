import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    FlashError,
    Footer,
    FormControls, Header,
    HeaderHelmet,
    HeaderLogo,
    LifeFields,
    ScreenReaderAnnouncement,
    ShippingLines,
    SummarySection,
    Title,
} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {
    useBeforeUnload,
    useGetLifeFields,
    useOnLoadValidateCustomer,
    useScrollToElementOnNavigation,
} from 'src/hooks';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants, LifeInputLocationConstants} from 'src/constants';

export function ShippingLinesPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading, title} = useShippingPage();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
    const shippingLinesLifeFields  = useGetLifeFields(LifeInputLocationConstants.SHIPPING_LINES);
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const headerLogoUrl = window.headerLogoUrl;
    useOnLoadValidateCustomer();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useEffect(() => {
        sendPageView('/shipping_lines', 2);
        sendEvents('Landed on shipping page', {'category': 'Checkout'});
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title || ''} />
            {mainContentBeginningLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>    
                    <div className={'outside-main-content'}>
                        <LifeFields lifeFields={mainContentBeginningLifeFields}/>
                    </div>
                </div> : null}
            <div className={'three-page'}>
                <Header isMobile={true} />
                <div className='customer-section' >
                    <header className={'main-header'}>
                        {headerLogoUrl 
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs active={active}/>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <ShippingLines theme={Constants.THREE_PAGE}/>
                            <LifeFields lifeFields={shippingLinesLifeFields}/>
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonText={nextButtonText}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonTestDataId={'footer-continue-to-payment-button'}
                            />
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
