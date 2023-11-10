import React, {useEffect} from 'react';
import {
    useDebounceCustomer,
    useGetCurrencyInformation,
    useGetLifeFields,
    useGetLineItems,
    useGetOrderTotal,
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions
} from 'src/hooks';
import {BrowserRouter, Route} from 'react-router-dom';
import {Redirect, Switch} from 'react-router';
import {ThankYouPage, OutOfStockPage, SessionExpiredPage} from 'src/pages';
import {PaymentPage, AdditionalInformationPage} from 'src/themes/paypal/pages';
import 'public/app.css';
import 'src/themes/paypal/paypal.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {useDispatch} from 'react-redux';
import {getCheckoutUrl, setHook} from 'src/utils';
import {useHistory} from  'react-router-dom';
import {initiateCheckout} from 'src/analytics';
import {
    Constants,
    LifeInputLocationConstants,
    debounceConstants
} from 'src/constants';
import {checkInventory} from 'src/library';
import {checkInventoryStage} from '@boldcommerce/checkout-frontend-library';

setHook('history', useHistory);

function ConditionalLifePageOrPaymentPage() {
    const paypalLifeFields = useGetLifeFields(LifeInputLocationConstants.PAYPAL_ADDITIONAL_INFORMATION);
    if (paypalLifeFields?.length) {
        return <AdditionalInformationPage />;
    } else {
        return <PaymentPage />;
    }
}

function Theme(): React.ReactElement {
    const dispatch = useDispatch();

    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(false);

    debounceConstants.debouncedGuestCustomerFunction = useDebounceCustomer();

    const items = useGetLineItems();
    const value = useGetOrderTotal();
    const {currency} = useGetCurrencyInformation();

    useEffect(() => {
        dispatch(checkInventory(checkInventoryStage.initial));
        window.history.replaceState(null, '', getCheckoutUrl(Constants.RESUME_ROUTE));
        initiateCheckout(items, value, currency);
    }, []);

    return (
        <div className={'App'}>
            <BrowserRouter>
                <Switch>
                    <Route path={`*/${Constants.OUT_OF_STOCK_ROUTE}`} component={OutOfStockPage} />
                    <Route path={`*/${Constants.PAYMENT_ROUTE}`} component={PaymentPage} />
                    <Route path={`*/${Constants.SESSION_EXPIRED_ROUTE}`} component={SessionExpiredPage} />
                    <Route path={`*/${Constants.THANK_YOU_ROUTE}`} component={ThankYouPage} />
                    <Route exact path={`*/${Constants.RESUME_ROUTE}`} component={ConditionalLifePageOrPaymentPage} />
                    <Redirect to={`/${Constants.RESUME_ROUTE}`} />
                </Switch>
                <StandaloneHooks/>
            </BrowserRouter>
            <Overlay/>
        </div>
    );
}
export default Theme;
