import React from 'react';
import {
    Breadcrumbs,
    FlashError,
    Footer, Header,
    ShippingLines,
    SummarySection,
} from 'src/components';
import {useBeforeUnload, useScrollToElementOnNavigation, useShippingPage} from 'src/hooks';

export function ShippingLinesPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading} = useShippingPage();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');

    return (
        <div className={'checkout-experience-container'}>
            <div className={'three-page'}>
                <Header isMobile={true} />
                <div className='customer-section' >
                    <Header isMobile={false} />
                    <Breadcrumbs active={active}/>
                    <FlashError/>
                    <ShippingLines/>
                    <Footer
                        backLinkOnClick={backLinkOnClick}
                        backLinkText={backLinkText}
                        nextButtonText={nextButtonText}
                        nextButtonDisable={nextButtonDisable}
                        nextButtonOnClick={nextButtonOnClick}
                        nextButtonLoading={nextButtonLoading}/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
