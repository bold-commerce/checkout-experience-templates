import {useCallback} from 'react';
import {actionRemoveErrorByField, actionUpdateAddressField, actionUpdateCustomerField} from 'src/action';
import {useDispatch} from 'react-redux';
import {useCallApiAtOnEvents, useGetAddressDataField} from 'src/hooks';
import {IAddressHookProps} from 'src/types';
import {AddressLabelMapping, Constants} from 'src/constants';
import {getTerm} from 'src/utils';
import {useGetErrorByField} from 'src/hooks';
import { useDebounceCustomer } from './useDebounceCustomer';

export function useGetAddressFieldInputData(type: string, fieldId: string, debounceApiCall: () => void, placeholderId: string): IAddressHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const debounceApiCallGuestCustomer = useDebounceCustomer();
    const name = fieldId;
    const placeholder = getTerm(AddressLabelMapping[placeholderId],Constants.SHIPPING_INFO);
    const errorMessage = useGetErrorByField(fieldId, type);

    const value: string = useGetAddressDataField(type, fieldId);
    const id = `${type}-address__${fieldId}`;

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const field = e.target.name;
        dispatch(actionUpdateAddressField(field ,value ,type));

        if(errorMessage){
            dispatch(actionRemoveErrorByField(fieldId, type));
        }

        if((fieldId === Constants.ADDRESS_FIRST_NAME || fieldId === Constants.ADDRESS_LAST_NAME) && type === Constants.SHIPPING){

            dispatch(actionUpdateCustomerField(field ,value));
            if(callApiAtOnEvents) {
                debounceApiCallGuestCustomer();
            }
        }

        if(callApiAtOnEvents) {
            debounceApiCall();
        }



    }, [type, errorMessage, fieldId]);

    return {placeholder, id, name , value, errorMessage, handleChange};
}
