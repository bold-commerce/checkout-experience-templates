import React, {useEffect} from 'react';
import {
    Breadcrumbs,
    SummarySection,
    Header,
    HeaderHelmet,
    ScreenReaderAnnouncement,
    Footer,
    HeaderLogo,
    Title,
} from 'src/components';
import {
    useBeforeUnload,
    useGetLifeFields,
    useGetLifeFieldsOnPage,
    useOnLoadDefaultLifeFields,
    useOnLoadValidateCustomerAndShipping,
    useScrollToElementOnNavigation,
} from 'src/hooks';
import {useHistory} from  'react-router-dom';
import {usePaymentPage} from 'src/themes/three-page/hooks';
import {sendEvents, sendPageView} from 'src/analytics';
import {getTerm} from 'src/utils';
import {
    Constants,
    LifeInputLocationConstants,
    LifeInputPageConstants
} from 'src/constants';
import {getBreadcrumbs} from 'src/themes/paypal/utils';

export function PaymentPage(): React.ReactElement {
    useOnLoadDefaultLifeFields(useGetLifeFieldsOnPage(LifeInputPageConstants.ONE_PAGE));
    useOnLoadValidateCustomerAndShipping();
    useScrollToElementOnNavigation('customer-section');
    useBeforeUnload();

    const history = useHistory();
    const {title} = usePaymentPage();

    const mainContentBeginningLifeFields = useGetLifeFields(LifeInputLocationConstants.MAIN_CONTENT_BEGINNING);    
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    const pageNumber = mainContentBeginningLifeFields?.length ? 2 : 1;
    const {crumbs, sectionLabel} = getBreadcrumbs(history, pageNumber);


    useEffect(() => {
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
                    <main aria-label={mainAriaLabel}>
                        {!!mainContentBeginningLifeFields?.length && (
                            <Breadcrumbs
                                active={pageNumber}
                                crumbs={crumbs}
                                sectionLabel={sectionLabel}
                            />
                        )}
                        <div>
                            <h1>PayPal Express buttons here</h1>
                        </div>
                    </main>
                    <Footer/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
