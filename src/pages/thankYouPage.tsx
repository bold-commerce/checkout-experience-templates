import ClassNames from 'classnames';
import React from 'react';

import {Header, SummarySection, ThankYou} from 'src/components';
import {useGetBillingData, useGetCustomerInfoData, useGetShippingData} from 'src/hooks';
import {isObjectEmpty} from 'src/utils';

export function ThankYouPage(): React.ReactElement {
    const customerInformation = useGetCustomerInfoData();
    const firstName = customerInformation && customerInformation.first_name ? customerInformation.first_name : '';
    const shippingAddress = useGetShippingData();
    const billingAddress = useGetBillingData();

    const isGeneric = !firstName && isObjectEmpty(shippingAddress) && isObjectEmpty(billingAddress);

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
