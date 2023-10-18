import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    SummarySection,
    Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    HeaderLogo,
    Title, FlashError, LoadingSection, LifeFields
} from 'src/components';
import {
    useBeforeUnload, useGetAppSettingData,
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useOnLoadDefaultLifeFields
} from 'src/hooks';
import {useHistory} from  'react-router-dom';
import {usePaymentPage} from 'src/themes/paypal/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {
    LifeInputLocationConstants,
    LifeInputPageConstants
} from 'src/constants';
import {getBreadcrumbs, initializePPCPExpressPay} from 'src/themes/paypal/utils';
import {useDispatch} from 'react-redux';

export function PaymentPage(): React.ReactElement {
    const dispatch = useDispatch();
    const history = useHistory();
    const {title, backLinkText, backLinkOnClick} = usePaymentPage();
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.PAYPAL_PAYMENT_PAGE));
    useBeforeUnload();

    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const paypalAdditionalInfoLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYPAL_ADDITIONAL_INFORMATION);
    const headerLogoUrl = window.headerLogoUrl;
    const pageNumber = paypalAdditionalInfoLifeFields?.length ? 2 : 1;
    const {crumbs, sectionLabel} = getBreadcrumbs(history, pageNumber);
    const isAnyButtonEnabled = useGetAppSettingData('isExpressPaySectionEnable') as boolean;


    useEffect(() => {
        dispatch(initializePPCPExpressPay(history));
        sendPageView('/payment', pageNumber);
        sendEvents('Landed on payment page', {'category': 'Checkout'});
    }, []);

    return (
        <div className={'checkout-experience-container'}>
            <HeaderHelmet title={title}/>
            <ScreenReaderAnnouncement content={title || ''}/>
            {mainContentBeginningLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-beginning-life-elements'} lifeFields={mainContentBeginningLifeFields}/>
                    </div>
                </div> : null}
            <div className={'paypal-page'}>
                <Header isMobile={true}/>
                <div className='payment-section'>
                    <header className={'main-header'}>
                        {headerLogoUrl
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={title}>
                        {!!paypalAdditionalInfoLifeFields?.length && (
                            <Breadcrumbs
                                active={pageNumber}
                                crumbs={crumbs}
                                sectionLabel={sectionLabel}
                            />
                        )}
                        <div className={'payment-content-section'}>
                            <FlashError/>
                            <LoadingSection className={'paypal-express-pay-loading'} isLoading={!isAnyButtonEnabled} />
                            <div id="express-payment-container" className={!isAnyButtonEnabled ? 'hidden' : ''}>
                            </div>
                        </div>
                        <div className={'form-controls'}>
                            <a data-testid={'back-link'} className={'form-controls__back-link'} href={'#footerBack'} onClick={backLinkOnClick}>
                                <span className={'form-controls__back-link--wrapper'}>
                                    {backLinkText}
                                </span>
                            </a>
                        </div>
                    </main>
                    <Footer/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
            {mainContentEndLifeFields.length > 0 ?
                <div className={'outside-main-content-container'}>
                    <div className={'outside-main-content'}>
                        <LifeFields className={'main-content-end-life-elements'} lifeFields={mainContentEndLifeFields}/>
                    </div>
                </div> : null}
        </div>
    );
}
