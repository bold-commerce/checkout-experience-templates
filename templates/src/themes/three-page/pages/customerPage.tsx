import React, {useEffect} from 'react';
import {BillingAddress, Breadcrumbs, CustomerInformation, ShippingAddress, SummarySection, Footer, FlashError, Header, ExpressPaymentGateway} from 'src/components';
import {useBeforeUnload, useScrollToElementOnNavigation, useSendEvent} from 'src/hooks';
import {useCustomerPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {NeuroIdConstants} from 'src/constants';
import {getNeuroIdPageName, neuroIdInit} from 'src/utils';

export function CustomerPage(): React.ReactElement {
    const {backLinkText, backLinkOnClick, nextButtonOnClick, nextButtonText, nextButtonDisable, active, nextButtonLoading} = useCustomerPage();
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
        neuroIdInit(getNeuroIdPageName(NeuroIdConstants.customerPage));

        sendPageView('/customer_information', 1);
        sendEvents('Checkout', 'Landed on customer information page');
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <div className={'three-page'}>
                <Header isMobile={true}/>
                <div className='customer-section' >
                    <Header isMobile={false}/>
                    <Breadcrumbs active={active}/>
                    <FlashError/>
                    <ExpressPaymentGateway/>
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
