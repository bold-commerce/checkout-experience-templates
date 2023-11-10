import {IAutocompleteData} from 'src/types';
import {actionUpdateBillingAddressField} from 'src/action';
import {Constants} from 'src/constants';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';

export function useDispatchAutocompleteBillingData(): (dataToDispatch: IAutocompleteData) => void {
    const dispatch = useDispatch();

    const dispatchAutocomplateBillingData = useCallback((dataToDispatch: IAutocompleteData) => {
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_ADDRESS_1, dataToDispatch.address1));
        if (dataToDispatch.address2) {
            dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_ADDRESS_2, dataToDispatch.address2));
        }
        if (dataToDispatch.company) {
            dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_BUSINESS, dataToDispatch.company));
        }
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_CITY, dataToDispatch.city));
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_POSTAL_CODE, dataToDispatch.postalCode));
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_COUNTRY_CODE, dataToDispatch.countryCode));
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_COUNTRY, dataToDispatch.country));
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_PROVINCE_CODE, dataToDispatch.provinceCode));
        dispatch(actionUpdateBillingAddressField(Constants.ADDRESS_PROVINCE, dataToDispatch.province));
    }, [dispatch]);

    return dispatchAutocomplateBillingData;
}
