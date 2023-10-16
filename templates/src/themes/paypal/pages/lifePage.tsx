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
import {useLifePage} from 'src/themes/paypal/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm, withPreventDefault} from 'src/utils';
import {
    Constants,
    LifeInputLocationConstants,
    LifeInputPageConstants
} from 'src/constants';

export function LifePage(): React.ReactElement {
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE));
    useScrollToElementOnNavigation('customer-section');
    useBeforeUnload();

    const {backLinkText, backLinkOnClick, nextButtonText, nextButtonOnClick, nextButtonLoading, nextButtonDisable, title} = useLifePage();
    // TODO add new location that is specific to this paypal flow
    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    useGetLifeFields;
    useEffect(() => {
        sendPageView('/life', 1);
        sendEvents('Landed on life page', {'category': 'Checkout'});
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
                    <main aria-label={mainAriaLabel}>
                        <Breadcrumbs active={1}/>
                        <form onSubmit={withPreventDefault(nextButtonOnClick as () => void)}>
                            <FlashError/>
                            {/* TODO replace mainContentBeginningLifeFields with new paypal specific location */}
                            <LifeFields lifeFields={mainContentBeginningLifeFields}/>
                            <FormControls
                                backLinkOnClick={backLinkOnClick}
                                backLinkText={backLinkText}
                                nextButtonLoading={nextButtonLoading}
                                nextButtonDisable={nextButtonDisable}
                                nextButtonText={nextButtonText}
                                nextButtonTestDataId={'footer-complete-order-button'}
                            />
                        </form>
                    </main>
                    <Footer/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
