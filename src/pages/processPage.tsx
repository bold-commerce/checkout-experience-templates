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
import {getCheckoutUrl, getTerm} from 'src/utils';
import {Constants} from 'src/constants';
import {actionShowHideOverlayContent} from 'src/action';
import {displayOrderProcessingScreen, getUpdatedApplicationState, processOrder} from 'src/library';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';
import {useGetErrors} from 'src/hooks';

export function ProcessPage({errorRoute}: {errorRoute: string}): React.ReactElement {
    const dispatch = useDispatch();
    const mainAriaLabel = getTerm('checkout_form_title', Constants.GLOBAL_INFO, undefined, 'Checkout form');
    const headerLogoUrl = window.headerLogoUrl;
    const title = 'Order Processing';
    const history = useHistory();
    const errors = useGetErrors();

    useEffect(() => {
        dispatch(displayOrderProcessingScreen);
        dispatch(actionShowHideOverlayContent(true));
        dispatch(processOrder(history));
    }, []);

    useEffect(() => {
        if (errors.length) {
            dispatch(getUpdatedApplicationState);
            history.replace(getCheckoutUrl(errorRoute));
        }
    }, [errors]);

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
                        <Breadcrumbs active={3}/>
                    </main>
                    <Footer/>
                </div>
                <SummarySection orderCompleted={false}/>
            </div>
        </div>
    );
}
