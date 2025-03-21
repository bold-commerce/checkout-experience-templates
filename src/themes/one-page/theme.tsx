import React, {useEffect} from 'react';
import {
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions,
    useDebounceCustomer,
    useGetGeneralSettingCheckoutFields,
    useFraudTools,
} from 'src/hooks';
import 'public/app.css';
import 'src/themes/one-page/onePage.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {Constants, debounceConstants} from 'src/constants';
import {useDispatch} from 'react-redux';
import {actionSetDefaultCustomerAcceptMarketing, actionUpdateBillingTypeInSettings} from 'src/action';
import {BrowserRouter, Route} from 'react-router-dom';
import {Redirect, Switch, useHistory} from 'react-router';
import {ThemePage} from 'src/themes/one-page/pages';
import {SessionExpiredPage, OutOfStockPage, ThankYouPage} from 'src/pages';
import {getDefaultBillingType, setHook} from 'src/utils';
import {ProcessPage} from 'src/pages';

setHook('history', useHistory);

function Theme () : React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(true);
    useFraudTools();
    debounceConstants.debouncedGuestCustomerFunction = useDebounceCustomer();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    const billingType = getDefaultBillingType();
    useEffect(() => {
        dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
        dispatch(actionUpdateBillingTypeInSettings(billingType));
    },[]);

    return (
        <div className={'App'}>
            <BrowserRouter>
                <Switch>
                    <Route path={`*/${Constants.OUT_OF_STOCK_ROUTE}`} component={OutOfStockPage} />
                    <Route path={`*/${Constants.THANK_YOU_ROUTE}`} component={ThankYouPage} />
                    <Route path={`*/${Constants.SESSION_EXPIRED_ROUTE}`} component={SessionExpiredPage} />
                    <Route path={`*/${Constants.PROCESS_ROUTE}`}>
                        <ProcessPage errorRoute={Constants.EXPERIENCE_ROUTE} />
                    </Route>
                    <Route path={`*/${Constants.EXPERIENCE_ROUTE}`} component={ThemePage} />
                    <Redirect to={`/${Constants.EXPERIENCE_ROUTE}`} />
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>
            <Overlay/>
        </div>
    );
}
export default Theme;


