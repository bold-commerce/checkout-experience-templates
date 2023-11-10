import {useDebouncedCallback} from 'use-debounce';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import {useDispatch} from 'react-redux';
import {Constants, debounceConstants} from 'src/constants';
import {useGetAppSettingData} from './useGetAppSettingData';
import {actionSetAppStateValid, actionSetLoader} from 'src/action';
import {useCallback} from 'react';

export function useDebouncedValidateAddress(type: string): () => void{
    const dispatch = useDispatch();
    const billingType = useGetAppSettingData('billingType');
    const callApiAtOnEvents = useGetAppSettingData('callApiAtOnEvents') as boolean;

    const debouncedUI = useDebouncedCallback(() => {
        if(callApiAtOnEvents){
            dispatch(actionSetAppStateValid('shippingAddress', true));
            if (type === Constants.SHIPPING) {
                dispatch(actionSetLoader('shippingLines', true));
            }
        }
    }, debounceConstants.DEBOUNCE_UI_UPDATE_TIME);

    const debouncedApi = useDebouncedCallback(() => {

        if (type === Constants.SHIPPING){
            dispatch(validateShippingAddress).then(() => {
                if(billingType === Constants.SHIPPING_SAME) {
                    dispatch(validateBillingAddress);
                }
            });
        } else if (type === Constants.BILLING){
            dispatch(validateBillingAddress);
        }
    }, debounceConstants.DEFAULT_DEBOUNCE_TIME);

    const debouncedValidateAddress = useCallback(() => {
        debouncedUI();
        debouncedApi();
    },[]);

    return debouncedValidateAddress;
}




