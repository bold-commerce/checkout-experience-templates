import {
    BillingAddress,
    CustomerInformation,
    ExpressPaymentGateway,
    FlashError, Footer,
    Header,
    HeaderHelmet, Payment, ShippingAddress, ShippingLines,
    SummarySection
} from 'src/components';
import React, { useEffect } from 'react';
import {getCheckoutUrl} from 'src/utils';
import {Constants} from 'src/constants';
import {useGetOnePageFooterData, useIsValidShippingOnLoad} from 'src/themes/one-page/hooks';
import {checkInventoryStage} from '@bold-commerce/checkout-frontend-library';
import { useDispatch } from 'react-redux';
import { checkInventory } from 'src/library';

export function ThemePage(): React.ReactElement {
    window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
    useIsValidShippingOnLoad();
    const footerProps = useGetOnePageFooterData();
    const dispatch = useDispatch();
    useEffect(() => { dispatch(checkInventory(checkInventoryStage.initial)); }, []);

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
