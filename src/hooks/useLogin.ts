import {useCallback} from 'react';
import {IUseLogin} from 'src/types';
import {useDispatch} from 'react-redux';
import {
    useGetCustomerInfoDataByField,
    useGetCustomerMarketingField,
    useCallApiAtOnEvents,
    useGetGeneralSettingCheckoutFields
} from 'src/hooks';
import {actionUpdateCustomerAcceptMarketing} from 'src/action';
import {debounceConstants} from 'src/constants';

export function useLogin(): IUseLogin{
    const loginUrl = useCallback((event) => {
        event.preventDefault();
        window.location.href = window.loginUrl;
    }, [window.loginUrl]);
    const dispatch = useDispatch();
    const debounceApiCall = debounceConstants.debouncedGuestCustomerFunction;
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const email = useGetCustomerInfoDataByField('email_address');
    const acceptMarketingChecked = useGetCustomerMarketingField();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option');
    const acceptMarketingHidden = (acceptMarketingSetting === 'hidden');

    const handleCheckboxChange = useCallback(() => {
        dispatch(actionUpdateCustomerAcceptMarketing(!acceptMarketingChecked));
        if (callApiAtOnEvents) {
            debounceApiCall();
        }
    }, [acceptMarketingChecked]);

    return {loginUrl, email, acceptMarketingChecked, handleCheckboxChange, acceptMarketingHidden};
}
