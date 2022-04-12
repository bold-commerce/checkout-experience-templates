import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    FlashError,
    Footer, Header,
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

export function ShippingLinesPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonDisable, nextButtonText, active, nextButtonLoading} = useShippingPage();
    useOnLoadValidateCustomer();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');
    useEffect(() => {
        sendPageView('/shipping_lines', 2);
        sendEvents('Checkout', 'Landed on shipping page');
    }, []);

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
