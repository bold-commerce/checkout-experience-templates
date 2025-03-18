import ClassNames from 'classnames';
import React, {useEffect} from 'react';

import {Header, HeaderHelmet, LifeFields, ScreenReaderAnnouncement, SummarySection, ThankYou} from 'src/components';
import {
    useGetBillingData,
    useGetCustomerInfoData,
    useGetIsOrderProcessed,
    useGetLifeFields,
    useGetShippingData,
    useGetValidVariable,
} from 'src/hooks';
import {getTerm, isObjectEmpty} from 'src/utils';
import {sendEvents, sendPageView} from 'src/analytics';
import {Constants, LifeInputLocationConstants} from 'src/constants';
import {actionShowHideOverlayContent} from 'src/action';
import {useDispatch} from 'react-redux';

export function ThankYouPage(): React.ReactElement {
    const customerInformation = useGetCustomerInfoData();
    const firstName = customerInformation && customerInformation.first_name ? customerInformation.first_name : '';
    const shippingAddress = useGetShippingData();
    const billingAddress = useGetBillingData();
    const orderProcessedValid = useGetValidVariable('orderProcessed');
    const orderProcessed = useGetIsOrderProcessed() || orderProcessedValid;
    const title = getTerm('thank_you_title', Constants.GLOBAL_INFO, undefined , 'Order confirmation');
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const dispatch = useDispatch();

    const isGeneric = !orderProcessed || (!firstName && isObjectEmpty(shippingAddress) && isObjectEmpty(billingAddress));
    useEffect(() => {
        sendPageView('/thank_you', 4);
        sendEvents('Landed on thank you page', {'category': 'Checkout'});
        dispatch(actionShowHideOverlayContent(false));
    }, []);

    const getClasses = ((baseClassName: string, classes?: Array<string> | string): string => {
        return ClassNames([baseClassName].concat(classes ?? []));
    });

    return (
        <>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title} />
            <div className={'checkout-experience-container'}>
                {mainContentBeginningLifeFields.length > 0 ?
                    <div className={'outside-main-content-container'}>
                        <div className={isGeneric ? getClasses('outside-main-content','no-summary') : getClasses('outside-main-content')}>
                            <LifeFields className={'main-content-beginning-life-elements'} lifeFields={mainContentBeginningLifeFields}/>
                        </div>
                    </div> : null}
                <div className={isGeneric ? getClasses('three-page','no-summary') : getClasses('three-page')}>
                    <Header isMobile={true} />
                    <ThankYou/>
                    { isGeneric ? null : <SummarySection orderCompleted={true}/>}
                </div>
                {mainContentEndLifeFields.length > 0 ?
                    <div className={'outside-main-content-container'}>
                        <div className={isGeneric ? getClasses('outside-main-content','no-summary') : getClasses('outside-main-content')}>
                            <LifeFields className={'main-content-end-life-elements'} lifeFields={mainContentEndLifeFields}/>
                        </div>
                    </div> : null}
            </div>
        </>
    );
}
