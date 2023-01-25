import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, HeaderHelmet, ScreenReaderAnnouncement, SummarySection, ThankYou} from 'src/components';
import {
    useGetBillingData,
    useGetCustomerInfoData,
    useGetShippingData,
    useGetValidVariable,
} from 'src/hooks';
import {getTerm, isObjectEmpty} from 'src/utils';
import {sendEvents, sendPageView} from 'src/analytics';
import {Constants} from 'src/constants';

export function ThankYouPage(): React.ReactElement {
    const customerInformation = useGetCustomerInfoData();
    const firstName = customerInformation && customerInformation.first_name ? customerInformation.first_name : '';
    const shippingAddress = useGetShippingData();
    const billingAddress = useGetBillingData();
    const orderProcessed = useGetValidVariable('orderProcessed');
    const title = getTerm('thank_you_title', Constants.GLOBAL_INFO, undefined , 'Order confirmation');

    const isGeneric = !orderProcessed || (!firstName && isObjectEmpty(shippingAddress) && isObjectEmpty(billingAddress));
    useEffect(() => {
        sendPageView('/thank_you', 4);
        sendEvents('Landed on thank you page', {'category': 'Checkout'});
    }, []);

    const getClasses = ((classes?: Array<string> | string): string => {
        return ClassNames(['three-page'].concat(classes ?? []));
    });

    return (
        <>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title} />
            <div className={'checkout-experience-container'}>
                <div className={isGeneric ? getClasses('no-summary') : getClasses()}>
                    <Header isMobile={true} />
                    <ThankYou/>
                    { isGeneric ? null : <SummarySection orderCompleted={true}/>}
                </div>
            </div>
        </>
    );
}
