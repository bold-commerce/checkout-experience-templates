import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    FormControls,
    SummarySection,
    FlashError,
    Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    HeaderLogo,
    Title,
    LifeFields
} from 'src/components';
import {
    useBeforeUnload,
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useOnLoadDefaultLifeFields,
    useScrollToElementOnNavigation,
} from 'src/hooks';
import {useAdditionalInformationPage} from 'src/themes/paypal/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {Constants, LifeInputLocationConstants, LifeInputPageConstants} from 'src/constants';
import {getBreadcrumbs} from 'src/themes/paypal/utils';
import {useHistory} from 'react-router';

export function AdditionalInformationPage(): React.ReactElement {
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.PAYPAL_ADDITIONAL_INFO_PAGE));
    useScrollToElementOnNavigation('additional-info-section');
    useBeforeUnload();

    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = useAdditionalInformationPage();

    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainContentEndLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_END);
    const paypalAdditionalInfoLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYPAL_ADDITIONAL_INFORMATION);

    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    const history = useHistory();
    const {crumbs, sectionLabel} = getBreadcrumbs(history, 1);
    useEffect(() => {
        sendPageView('/additional_information', 1);
        sendEvents('Landed on additional information page', {'category': 'Checkout'});
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
                <div className='additional-info-section'>
                    <header className={'main-header'}>
                        {headerLogoUrl
                            ? <HeaderLogo />
                            : <Title/>
                        }
                    </header>
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs
                            active={1}
                            crumbs={crumbs}
                            sectionLabel={sectionLabel}
                        />
                        <form onSubmit={withPreventDefault(nextButtonOnClick as () => void)}>
                            <FlashError/>
                            <div className={'additional-information'}>
                                <LifeFields  className={'paypal-additional-information-life-elements'} lifeFields={paypalAdditionalInfoLifeFields}/>
                            </div>
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonText={nextButtonText}
                                nextButtonTestDataId={'footer-continue-to-payment-button'}
                            />
                        </form>
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
