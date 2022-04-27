import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, SummarySection, ThankYou} from 'src/components';
import {useGetBillingData, useGetCustomerInfoData, useGetShippingData, useGetValidVariable,} from 'src/hooks';
import {getNeuroIdPageName, isObjectEmpty, neuroIdInit} from 'src/utils';
import {sendEvents, sendPageView} from 'src/analytics';
import {NeuroIdConstants} from 'src/constants';

export function ThankYouPage(): React.ReactElement {
    const customerInformation = useGetCustomerInfoData();
    const firstName = customerInformation && customerInformation.first_name ? customerInformation.first_name : '';
    const shippingAddress = useGetShippingData();
    const billingAddress = useGetBillingData();
    const orderProcessed = useGetValidVariable('orderProcessed');

    const isGeneric = !orderProcessed || (!firstName && isObjectEmpty(shippingAddress) && isObjectEmpty(billingAddress));

    useEffect(() => {
        neuroIdInit(getNeuroIdPageName(NeuroIdConstants.thankYouPage));

        sendPageView('/thank_you', 4);
        sendEvents('Checkout', 'Landed on thank you page');
    }, []);

    const getClasses = ((classes?: Array<string> | string): string => {
        return ClassNames(['three-page'].concat(classes ?? []));
    });

    return (
        <div className={'checkout-experience-container'}>
            <div className={isGeneric ? getClasses('no-summary') : getClasses()}>
                <Header isMobile={true} />
                <ThankYou/>
                { isGeneric ? null : <SummarySection orderCompleted={true}/>}
            </div>
        </div>
    );
}
