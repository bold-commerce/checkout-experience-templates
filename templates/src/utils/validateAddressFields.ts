import {IOrderInitialization} from 'src/types';
import {Constants, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {actionAddError} from 'src/action';
import {Dispatch} from 'redux';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

export function validateAddressFields(validationFields: Partial<IAddress>, type: string, dispatch: Dispatch, getState: () => IOrderInitialization): boolean {
    const allowedCountries = getState().data.initial_data.country_info;
    const defaultError = {
        message: '',
        type: errorTypes.address,
        field: '',
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        address_type: type
    };

    // Checking that all the fields are filled in or in the case of country and province, that they are
    // filled in and allowed
    return Object.entries(validationFields).reduce<boolean>((latch, [ key, value ]) => {
        if (value?.trim() === '') {
            dispatch(actionAddError({
                ...defaultError,
                field: key,
            }));

            return false;
        }

        // Checking that the entered county is allowed
        if (key === Constants.ADDRESS_COUNTRY_CODE && type === Constants.SHIPPING) {
            const isCountryAllowed = allowedCountries.some(x => x.iso_code === value);
            !isCountryAllowed && dispatch(actionAddError({
                ...defaultError,
                severity: errorSeverities.critical,
                sub_type: errorSubTypes.no_shipping_to_address,
                field: key,
            }));

            return latch && isCountryAllowed;
        }

        // Checking that the entered province is allowed
        if (key === Constants.ADDRESS_PROVINCE_CODE && type === Constants.SHIPPING) {
            const countryCode = validationFields[Constants.ADDRESS_COUNTRY_CODE];
            const country = allowedCountries.find(x => x.iso_code === countryCode)
                ?? {provinces: [{iso_code: value}]}; // If country is not found, we assume the province is allowed and let the country field error when iterated over

            const isProviceAllowed = country.provinces.some(x => x.iso_code === value);
            !isProviceAllowed && dispatch(actionAddError({
                ...defaultError,
                severity: errorSeverities.critical,
                sub_type: errorSubTypes.no_shipping_to_address,
                field: key,
            }));

            return latch && isProviceAllowed;
        }

        return latch;
    }, true);
}
