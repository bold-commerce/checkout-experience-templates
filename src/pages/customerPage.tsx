import React from 'react';
import {BillingAddress, Breadcrumbs, CustomerInformation, ShippingAddress, SummarySection, Footer, FlashError, Header} from 'src/components';
import {useBeforeUnload, useCustomerPage, useScrollToElementOnNavigation} from 'src/hooks';

export function CustomerPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading} = useCustomerPage();
    useBeforeUnload();
    useScrollToElementOnNavigation('customer-section');

    return (
        <div className={'checkout-experience-container'}>
            <div className={'three-page'}>
                <Header isMobile={true}/>
                <div className='customer-section' >
                    <Header isMobile={false}/>
                    <Breadcrumbs active={active}/>
                    <FlashError/>
                    <CustomerInformation/>
                    <ShippingAddress/>
                    <BillingAddress/>
                    <Footer
                        backLinkOnClick={backLinkOnClick}
                        backLinkText={backLinkText}
                        nextButtonText={nextButtonText}
                        nextButtonOnClick={nextButtonOnClick}
                        nextButtonDisable={nextButtonDisable}
                        nextButtonLoading={nextButtonLoading}
                    />
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
