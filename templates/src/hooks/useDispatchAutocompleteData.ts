import {IAutocompleteData} from 'src/types';
import {actionUpdateShippingAddressField} from 'src/action';
import {Constants} from 'src/constants';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';

export function useDispatchAutocompleteData(): (dataToDispatch: IAutocompleteData) => void {
    const dispatch = useDispatch();

    const dispatchAutocomplateData = useCallback((dataToDispatch: IAutocompleteData) => {
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_ADDRESS_1, dataToDispatch.address1));
        if (dataToDispatch.address2) {
            dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_ADDRESS_2, dataToDispatch.address2));
        }
        if (dataToDispatch.company) {
            dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_BUSINESS, dataToDispatch.company));
        }
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_CITY, dataToDispatch.city));
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_POSTAL_CODE, dataToDispatch.postalCode));
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_COUNTRY_CODE, dataToDispatch.countryCode));
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_COUNTRY, dataToDispatch.country));
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_PROVINCE_CODE, dataToDispatch.provinceCode));
        dispatch(actionUpdateShippingAddressField(Constants.ADDRESS_PROVINCE, dataToDispatch.province));
    }, [dispatch]);

    return dispatchAutocomplateData;
}
