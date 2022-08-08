import React from 'react';
import {
    CustomerInformation,
    ShippingAddress,
    BillingAddress,
    ShippingLines,
    Payment,
    Footer,
    FlashError,
    Header,
    ExpressPaymentGateway
} from 'src/components';
import {IFooterProps} from 'src/types';
import {useGetOnePageFooterData} from 'src/themes/one-page/hooks';

export function CustomerSection(): React.ReactElement {
    const footerProps: IFooterProps = useGetOnePageFooterData();

    return (
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

    );
}
