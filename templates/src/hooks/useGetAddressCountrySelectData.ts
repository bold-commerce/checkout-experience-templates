import {useDispatch} from 'react-redux';
import {useGetCountryInfoList, useGetAddressDataField, useCallApiAtOnEvents, useGetErrorByField} from 'src/hooks';
import {useCallback} from 'react';
import {actionUpdateAddressField, actionRemoveErrorByField} from 'src/action';
import {IAddressCountryHookProps} from 'src/types';
import {AddressLabelMapping, Constants, defaultAddressState} from 'src/constants';
import {getTerm} from 'src/utils';
import {ICountryInformation} from '@boldcommerce/checkout-frontend-library';

export function useGetAddressCountryInputData(type: string, debounceApiCall: () => void): IAddressCountryHookProps {
    const dispatch = useDispatch();
    const callApiAtOnEvents: boolean = useCallApiAtOnEvents();
    const name = Constants.ADDRESS_COUNTRY;
    const placeholder = getTerm('country_field_placeholder',Constants.SHIPPING_INFO);
    const label = getTerm(AddressLabelMapping[Constants.ADDRESS_COUNTRY],Constants.SHIPPING_INFO);
    const countriesList: Array<ICountryInformation> = useGetCountryInfoList();
    const countryOptions = countriesList.map(country => ({value: country.iso_code, name: country.name}));
    countryOptions.sort((a, b) => a.name < b.name ? -1 : 1);
    let value: string = useGetAddressDataField(type, Constants.ADDRESS_COUNTRY_CODE);
    let countryName = useGetAddressDataField(type, Constants.ADDRESS_COUNTRY);
    const id = `${type}-address__country`;
    const dataTestId = `${type}-address-country`;
    const countryError = useGetErrorByField('country', type);
    const countryCodeError = useGetErrorByField('country_code', type);
    let errorMessage: string | undefined;
    if (countryError || countryCodeError) {
        errorMessage = `${countryError} ${countryCodeError}`;
    } else {
        errorMessage = undefined;
    }
    if (countriesList && countriesList.length === 1) {
        if (countryName === '') {
            countryName = countriesList[0].name;
            dispatch(actionUpdateAddressField(Constants.ADDRESS_COUNTRY, countryName, type));
        }
        if (value === '') {
            value = countriesList[0].iso_code;
            dispatch(actionUpdateAddressField(Constants.ADDRESS_COUNTRY_CODE, value, type));
        }
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

    return {placeholder, label, id, name, value, countryOptions, countryName, handleChange, errorMessage, dataTestId};
}
