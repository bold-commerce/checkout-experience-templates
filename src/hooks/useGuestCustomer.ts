import {
    useCallApiAtOnEvents,
    useGetCustomerInfoDataByField,
    useGetCustomerMarketingField,
    useGetGeneralSettingCheckoutFields
} from 'src/hooks';
import {useDispatch} from 'react-redux';
import {getTerm} from 'src/utils';
import {useCallback} from 'react';
import {actionUpdateCustomerAcceptMarketing, actionUpdateCustomerEmail} from 'src/action/customerAction';
import {IUseGuestCustomer} from 'src/types';
import {useGetErrorByField} from 'src/hooks';
import {actionRemoveErrorByField} from 'src/action';
import {debounceConstants} from 'src/constants';

export function useGuestCustomer(): IUseGuestCustomer {
    const dispatch = useDispatch();
    const debounceApiCall = debounceConstants.debouncedGuestCustomerFunction;
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const emailErrorEmailAddress = useGetErrorByField('email_address');
    const emailErrorEmail = useGetErrorByField('email'); // TODO: Request PAPI to Fix this field return in the error.
    const email = useGetCustomerInfoDataByField('email_address');
    const acceptMarketingChecked = useGetCustomerMarketingField();
    const acceptMarketingSetting = useGetGeneralSettingCheckoutFields('accepts_marketing_checkbox_option');
    const acceptMarketingHidden = (acceptMarketingSetting === 'hidden');

    let emailError: string | undefined;
    if (emailErrorEmailAddress || emailErrorEmail) {
        emailError = `${emailErrorEmailAddress} ${emailErrorEmail}`;
    } else {
        emailError = undefined;
    }

    const handleChange = useCallback(e => {
        const value = e.target.value;
        if (emailErrorEmailAddress || emailErrorEmail) {
            dispatch(actionRemoveErrorByField('email_address'));
            dispatch(actionRemoveErrorByField('email')); // TODO: Request PAPI to Fix this field return in the error.
        }
        dispatch(actionUpdateCustomerEmail(value));
        if (callApiAtOnEvents) {
            debounceApiCall();
        }
    }, [emailErrorEmailAddress, emailErrorEmail, callApiAtOnEvents]);

    const handleCheckboxChange = useCallback(() => {
        const value = !acceptMarketingChecked;
        dispatch(actionUpdateCustomerAcceptMarketing(value));
        if (callApiAtOnEvents) {
            debounceApiCall();
        }
    }, [acceptMarketingChecked]);

    return {email, getTerm, emailError, handleChange, handleCheckboxChange, acceptMarketingChecked, acceptMarketingHidden};
}
