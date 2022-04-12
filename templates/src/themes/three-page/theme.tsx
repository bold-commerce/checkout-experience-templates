import React from 'react';
import {
    useGetGeneralSettingCheckoutFields,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions
} from 'src/hooks';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from 'react-router';
import {ThankYouPage, OutOfStockPage, SessionExpiredPage} from 'src/pages';
import {CustomerPage, PaymentPage, ShippingLinesPage} from 'src/themes/three-page/pages';
import 'public/app.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {actionSetDefaultCustomerAcceptMarketing} from 'src/action';
import {useDispatch} from 'react-redux';
import {setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import {initiateCheckout} from 'src/analytics';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(false);
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
    initiateCheckout();

    return (
        <div className={'App'}>
            <BrowserRouter>
                <Switch>
                    <Route path='*/out_of_stock' component={OutOfStockPage} />
                    <Route path='*/payment' component={PaymentPage} />
                    <Route path='*/session_expired' component={SessionExpiredPage} />
                    <Route path='*/shipping_lines' component={ShippingLinesPage} />
                    <Route path='*/thank_you' component={ThankYouPage} />
                    <Route path='*/experience' component={CustomerPage} />
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>

            <Overlay/>
        </div>
    );
}
export default Theme;
