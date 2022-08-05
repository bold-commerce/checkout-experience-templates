import React, {useEffect} from 'react';
import {
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions,
    useDebounceCustomer,
    useGetGeneralSettingCheckoutFields
} from 'src/hooks';
import 'public/app.css';
import {Overlay, StandaloneHooks} from 'src/components';
import {Constants, debounceConstants} from 'src/constants';
import {useDispatch} from 'react-redux';
import {actionSetDefaultCustomerAcceptMarketing} from 'src/action';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch, useHistory} from 'react-router';
import {ThemePage} from 'src/themes/one-page/pages';
import {ThankYouPage} from 'src/pages';
import {setHook} from 'src/utils';

setHook('history', useHistory);

function Theme () : React.ReactElement {
    const dispatch = useDispatch();
    useSetDefaultLanguageIso();
    useWindowDimensions();
    useSetApiCallOnEvent(true);
    debounceConstants.debouncedGuestCustomerFunction = useDebounceCustomer();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option') as string;
    useEffect(() => {
        dispatch(actionSetDefaultCustomerAcceptMarketing(acceptMarketingSetting));
    },[]);

    return (
        <div className={'App'}>
            <BrowserRouter>
                <Switch>
                    <Route path={`*/${Constants.THANK_YOU_ROUTE}`} component={ThankYouPage} />
                    <Route path={`*/${Constants.EXPERIENCE_ROUTE}`} component={ThemePage} />
                    <StandaloneHooks/>
                </Switch>
            </BrowserRouter>
            <Overlay/>
        </div>
    );
}
export default Theme;


