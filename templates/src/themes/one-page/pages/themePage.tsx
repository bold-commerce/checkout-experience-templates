import {
    BillingAddress,
    CustomerInformation,
    ExpressPaymentGateway,
    FlashError, Footer,
    Header,
    HeaderHelmet, Payment, ShippingAddress, ShippingLines,
    SummarySection
} from 'src/components';
import React from 'react';
import {getCheckoutUrl} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {IFooterProps} from 'src/types';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    const footerProps: IFooterProps = useGetOnePageFooterData();

    return (
        <div className={'checkout-experience-container'}>
            <Header isMobile={true}/>
            <HeaderHelmet title={footerProps.title}/>
            <div className={'customer-section'}>
                <Header isMobile={false}/>
                <FlashError/>
                <ExpressPaymentGateway/>
                <CustomerInformation/>
                <ShippingAddress/>
                <BillingAddress/>
                <ShippingLines/>
                <Payment/>
                <Footer {...footerProps}/>
            </div>
            <SummarySection orderCompleted={false}/>
        </div>
    );
}
