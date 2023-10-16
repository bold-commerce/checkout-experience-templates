import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    SummarySection,
    Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    HeaderLogo,
    Title, FlashError, LoadingSection
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
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE));
    useBeforeUnload();

    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const headerLogoUrl = window.headerLogoUrl;
    const pageNumber = mainContentBeginningLifeFields?.length ? 2 : 1;
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

            <div className={'three-page'}>
                <Header isMobile={true}/>
                <div className='customer-section'>
                    <header className={'main-header'}>
                        {headerLogoUrl
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={title}>
                        {!!mainContentBeginningLifeFields?.length && (
                            <Breadcrumbs
                                active={pageNumber}
                                crumbs={crumbs}
                                sectionLabel={sectionLabel}
                            />
                        )}
                        <div>
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
        </div>
    );
}
