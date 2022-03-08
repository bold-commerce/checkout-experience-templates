import React from 'react';
import {Breadcrumbs, Footer, Payment, SummarySection, FlashError, Header} from 'src/components';
import {useBeforeUnload, usePaymentPage, useScrollToElementOnNavigation} from 'src/hooks';

export function PaymentPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading} = usePaymentPage();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');

    return (
        <div className={'checkout-experience-container'}>
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
                        nextButtonDisable={nextButtonLoading}
                        nextButtonText={nextButtonText}
                        nextButtonOnClick={nextButtonOnClick}/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
