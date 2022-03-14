import React, { useCallback } from 'react';
import {
    useGetGeneralSettingCheckoutFields,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions
} from 'src/hooks';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import { ThankYouPage, OutOfStockPage, SessionExpiredPage} from 'src/pages';
import 'public/app.css';
import 'src/themes/buy-now/buyNow.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {actionSetDefaultCustomerAcceptMarketing} from 'src/action';
import {useDispatch} from 'react-redux';
import {setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import { BuyNowContainerPage } from 'src/themes/buy-now/pages';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(true);
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));

    const closeModal = useCallback((e) => {
        if (e.target.className === 'checkout-experience-container') {
            document.dispatchEvent(new CustomEvent('buyNow:close'));
        }
    }, []);

    return (
        <div className={'buy-now__app'} onClick={closeModal}>
            <BrowserRouter>
                <Switch>
                    <Route path='/out_of_stock' component={OutOfStockPage} />
                    <Route path='/session_expired' component={SessionExpiredPage} />
                    <Route path='/thank_you' component={ThankYouPage} />
                    <Route path='/' component={BuyNowContainerPage}/>
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>
            <Overlay/>
        </div>
    );
}
export default Theme;
