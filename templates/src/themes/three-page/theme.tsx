import React, {useEffect} from 'react';
import {
    useDebounceCustomer,
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
import 'src/themes/three-page/three-page.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {actionSetDefaultCustomerAcceptMarketing, actionUpdateBillingTypeInSettings} from 'src/action';
import {useDispatch} from 'react-redux';
import {setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import {initiateCheckout} from 'src/analytics';
import {Constants, debounceConstants} from 'src/constants';
import {getDefaultBillingType} from 'src/utils';
import {checkInventory} from 'src/library';
import {checkInventoryStage} from '@boldcommerce/checkout-frontend-library';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(false);
    const billingType = getDefaultBillingType();
    debounceConstants.debouncedGuestCustomerFunction = useDebounceCustomer();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    initiateCheckout();

    useEffect(() => {
        dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
        dispatch(actionUpdateBillingTypeInSettings(billingType));
        dispatch(checkInventory(checkInventoryStage.initial));
    }, []);

    return (
        <div className={'App'}>
            <BrowserRouter>
                <Switch>
                    <Route path={`*/${Constants.OUT_OF_STOCK_ROUTE}`} component={OutOfStockPage} />
                    <Route path={`*/${Constants.PAYMENT_ROUTE}`} component={PaymentPage} />
                    <Route path={`*/${Constants.SESSION_EXPIRED_ROUTE}`} component={SessionExpiredPage} />
                    <Route path={`*/${Constants.SHIPPING_ROUTE}`} component={ShippingLinesPage} />
                    <Route path={`*/${Constants.THANK_YOU_ROUTE}`} component={ThankYouPage} />
                    <Route path={`*/${Constants.EXPERIENCE_ROUTE}`} component={CustomerPage} />
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>

            <Overlay/>
        </div>
    );
}
export default Theme;
