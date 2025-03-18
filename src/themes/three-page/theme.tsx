import React, {useEffect} from 'react';
import {
    useDebounceCustomer,
    useGetCurrencyInformation,
    useGetGeneralSettingCheckoutFields,
    useGetIsOrderProcessed,
    useGetLineItems,
    useGetOrderTotal,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions,
    useFraudTools,
} from 'src/hooks';
import {BrowserRouter, Route} from 'react-router-dom';
import {Redirect, Switch} from 'react-router';
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
import {ProcessPage} from 'src/pages';

setHook('history', useHistory);

function Theme(): React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(false);
    const billingType = getDefaultBillingType();
    debounceConstants.debouncedGuestCustomerFunction = useDebounceCustomer();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    const items = useGetLineItems();
    const value = useGetOrderTotal();
    const {currency} = useGetCurrencyInformation();
    const orderProcessed = useGetIsOrderProcessed();
    useFraudTools();

    useEffect(() => {
        dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
        dispatch(actionUpdateBillingTypeInSettings(billingType));
        const skipInventory = (new URLSearchParams(window.location.search)).has('skipInventory');
        if (!orderProcessed && !skipInventory) {
            dispatch(checkInventory(checkInventoryStage.initial));
        }
        initiateCheckout(items, value, currency);
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
                    {/**
                     * The EXPERIENCE_ROUTE is passed as the error route to the process page instead
                     * of the payment page because it thinks everything is invalid because that's the
                     * default state, and it would just redirect to the experience route anyway.
                     */}
                    <Route path={`*/${Constants.PROCESS_ROUTE}`}>
                        <ProcessPage errorRoute={Constants.EXPERIENCE_ROUTE} />
                    </Route>
                    <Route path={`*/${Constants.EXPERIENCE_ROUTE}`} component={CustomerPage} />
                    <Redirect to={`/${Constants.EXPERIENCE_ROUTE}`} />
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>

            <Overlay/>
        </div>
    );
}
export default Theme;
