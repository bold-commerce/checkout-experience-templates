import React, { useCallback } from 'react';
import {
    useGetGeneralSettingCheckoutFields,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions
} from 'src/hooks';
import {MemoryRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import 'public/app.css';
import 'src/themes/buy-now/buyNow.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {actionSetDefaultCustomerAcceptMarketing} from 'src/action';
import {useDispatch} from 'react-redux';
import {setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import { BuyNowContainerPage, OutOfStockPage, SessionExpiredPage, ThankYouPage } from 'src/themes/buy-now/pages';
import { useGetCloseBuyNow } from 'src/themes/buy-now/hooks';
import { initiateCheckout } from 'src/analytics';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const dispatch = useDispatch();
    const closeHeader = useGetCloseBuyNow();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(true);
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
    initiateCheckout();

    const closeModal = useCallback((e) => {
        if (e.target.className === 'checkout-experience-container' || e.target.className === 'buy-now__app') {
            closeHeader();
        }
    }, []);

    return (
        <div className={'buy-now__app'} onClick={closeModal}>
            <div className="checkout-experience-container overlay-container">
                <Overlay/> 
            </div>
            <MemoryRouter>
                <Switch>
                    <Route path='*/out_of_stock' component={OutOfStockPage} />
                    <Route path='*/session_expired' component={() => <SessionExpiredPage closeModal={closeHeader}/>} />
                    <Route path='*/thank_you' component={ThankYouPage} />
                    <Route path='*/' component={BuyNowContainerPage}/>
                </Switch>
                <StandaloneHooks/>
            </MemoryRouter>
        </div>
    );
}
export default Theme;
