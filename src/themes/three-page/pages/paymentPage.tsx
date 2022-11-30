import React, {useEffect} from 'react';
import {Breadcrumbs, Footer, Payment, SummarySection, FlashError, Header, HeaderHelmet, ScreenReaderAnnouncement} from 'src/components';
import {
    useBeforeUnload,
    useOnLoadValidateCustomerAndShipping,
    useScrollToElementOnNavigation
} from 'src/hooks';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';

export function PaymentPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = usePaymentPage();
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
                    <Breadcrumbs active={3}/>
                    <FlashError/>
                    <Payment/>
                    <Footer
                        backLinkOnClick={backLinkOnClick}
                        backLinkText={backLinkText}
                        nextButtonLoading={nextButtonLoading}
                        nextButtonDisable={nextButtonDisable}
                        nextButtonText={nextButtonText}
                        nextButtonOnClick={nextButtonOnClick}/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
