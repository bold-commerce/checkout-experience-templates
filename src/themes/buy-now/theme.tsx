import React, {useCallback} from 'react';
import {
    useGetOverlayVisible,
    useGetIsOrderProcessing,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions
} from 'src/hooks';
import {MemoryRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import 'public/app.css';
import 'src/themes/buy-now/buyNow.css';
import {CloseableHeader, Overlay, StandaloneHooks} from 'src/components';
import {setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import {BuyNowContainerPage, OutOfStockPage, SessionExpiredPage, ThankYouPage} from 'src/themes/buy-now/pages';
import {useGetCloseBuyNow} from 'src/themes/buy-now/hooks';
import {initiateCheckout} from 'src/analytics';
import FocusTrap from 'focus-trap-react';
import {focusTrapOptions} from 'src/constants';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const {websiteName, closeBuyNow} = useGetCloseBuyNow();
    const overlayVisible = useGetOverlayVisible();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(true);
    initiateCheckout();
    const isOrderProcessing = useGetIsOrderProcessing();

    const closeModal = useCallback((e) => {
        if (e.target.className === 'checkout-experience-container' || e.target.className === 'buy-now__app') {
            closeBuyNow();
        }
    }, []);

    return (
        <div className={'buy-now__app'} role='dialog' aria-modal={true} aria-label={`Buy now checkout ${window.shopName}`} onClick={closeModal}>
            <FocusTrap active={overlayVisible} focusTrapOptions={focusTrapOptions} >
                <div className={`checkout-experience-container overlay-container ${isOrderProcessing ? 'buy-now--processing-order' : ''}`}>
                    <Overlay>
                        <CloseableHeader title={websiteName} onClose={closeBuyNow} />
                    </Overlay> 
                </div>
            </FocusTrap>
            <MemoryRouter>
                <Switch>
                    <Route path='*/out_of_stock' component={OutOfStockPage} />
                    <Route path='*/session_expired' component={SessionExpiredPage} />
                    <Route path='*/thank_you' component={ThankYouPage} />
                    <Route path='*/' component={BuyNowContainerPage}/>
                </Switch>
                <StandaloneHooks/>
            </MemoryRouter>
        </div>
    );
}
export default Theme;
