import {useDispatch} from 'react-redux';
import {useGetCountryInfoList, useGetAddressDataField, useCallApiAtOnEvents, useGetErrorByField} from 'src/hooks';
import {useCallback} from 'react';
import {actionUpdateAddressField, actionRemoveErrorByField} from 'src/action';
import {IAddressCountryHookProps, ICountryInformation} from 'src/types';
import {AddressLabelMapping, Constants, defaultAddressState} from 'src/constants';
import {getTerm} from 'src/utils';

export function useGetAddressCountryInputData(type: string, debounceApiCall: () => void): IAddressCountryHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const name = Constants.ADDRESS_COUNTRY;
    const placeholder = getTerm('country_field_placeholder',Constants.SHIPPING_INFO);
    const label = getTerm(AddressLabelMapping[Constants.ADDRESS_COUNTRY],Constants.SHIPPING_INFO);
    const countriesList: ICountryInformation[] = useGetCountryInfoList();
    const countryOptions = countriesList.map(country => ({ value: country.iso_code, name: country.name }));
    const value: string = useGetAddressDataField(type, Constants.ADDRESS_COUNTRY_CODE);
    const id = `${type}-address__country`;
    const countryError = useGetErrorByField('country', type);
    const countryCodeError = useGetErrorByField('country_code', type);
    let errorMessage: string | undefined;
    if (countryError || countryCodeError) {
        errorMessage = `${countryError} ${countryCodeError}`;
    } else {
        errorMessage = undefined;
    }

    const handleChange = useCallback(e => {
        const value = e.target.value;
        const field = e.target[e.target.selectedIndex].text;
        dispatch(actionUpdateAddressField(Constants.ADDRESS_COUNTRY, field, type ));
        dispatch(actionUpdateAddressField(Constants.ADDRESS_COUNTRY_CODE, value, type ));
        dispatch(actionUpdateAddressField(Constants.ADDRESS_PROVINCE, defaultAddressState.province, type ));
        dispatch(actionUpdateAddressField(Constants.ADDRESS_PROVINCE_CODE, defaultAddressState.province_code, type ));

        if(errorMessage){
            dispatch(actionRemoveErrorByField('country', type));
            dispatch(actionRemoveErrorByField('country_code', type));
        }

        if(callApiAtOnEvents) {
            debounceApiCall();
        }
    }, [errorMessage, callApiAtOnEvents, type]);

    return {placeholder, label, id, name , value, countryOptions ,handleChange, errorMessage};
}
