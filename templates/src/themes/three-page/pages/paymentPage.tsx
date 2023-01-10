import React, {useEffect} from 'react';
import {Breadcrumbs, FormControls, Payment, SummarySection, FlashError, Header, HeaderHelmet, ScreenReaderAnnouncement, Footer} from 'src/components';
import {
    useBeforeUnload,
    useOnLoadValidateCustomerAndShipping,
    useScrollToElementOnNavigation
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants} from 'src/constants';

export function PaymentPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = usePaymentPage();
    const mainAriaLabel = getTerm('checkout_form', Constants.GLOBAL_INFO);
    useOnLoadValidateCustomerAndShipping();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useEffect(() => {
        sendPageView('/payment', 3);
        sendEvents('Checkout', 'Landed on payment page');
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
                        <Breadcrumbs active={3}/>
                        <form onSubmit={withPreventDefault(nextButtonOnClick)}>
                            <FlashError/>
                            <Payment/>
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonText={nextButtonText}
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
