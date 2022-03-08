import React from 'react';
import {
    CustomerInformation,
    ShippingAddress,
    BillingAddress,
    ShippingLines,
    Payment,
    Footer,
    FlashError,
    Header
} from 'src/components';
import {IFooterProps} from 'src/types';
import {useGetOnePageFooterData} from 'src/hooks';

export function CustomerSection(): React.ReactElement {
    const footerProps: IFooterProps = useGetOnePageFooterData();

    return (
        <div className={'customer-section'}>
            <Header isMobile={false}/>
            <FlashError/>
            <CustomerInformation/>
            <ShippingAddress/>
            <BillingAddress/>
            <ShippingLines/>
            <Payment/>
            <Footer {...footerProps}/>
        </div>

    );
}
