import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    FlashError,
    Footer,
    FormControls, Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    ShippingLines,
    SummarySection,
} from 'src/components';
import {sendEvents, sendPageView} from 'src/analytics';
import {
    useBeforeUnload,
    useOnLoadValidateCustomer,
    useScrollToElementOnNavigation,
} from 'src/hooks';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants} from 'src/constants';

export function ShippingLinesPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading, title} = useShippingPage();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined , 'Checkout form');
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
            <div className={'three-page'}>
                <Header isMobile={true} />
                <div className='customer-section' >
                    <Header isMobile={false} />
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs active={active}/>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <ShippingLines/>
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
        </div>
    );
}
