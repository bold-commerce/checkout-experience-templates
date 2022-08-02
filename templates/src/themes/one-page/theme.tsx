import React, {useEffect} from 'react';
import {
    useSetApiCallOnEvent,
    useSetDefaultLanguageIso,
    useWindowDimensions,
    useDebounceCustomer,
    useGetGeneralSettingCheckoutFields
} from 'src/hooks';
import 'public/app.css';
import {Overlay, SummarySection, CustomerSection, Header} from 'src/components';
import {debounceConstants} from 'src/constants';
import {useDispatch} from 'react-redux';
import {actionSetDefaultCustomerAcceptMarketing} from 'src/action';

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
            <div className={'checkout-experience-container'}>
                <Header isMobile={true}/>
                <CustomerSection/>
                <SummarySection orderCompleted={false}/>
            </div>
            <Overlay/>
        </div>

    );
}
export default Theme;


