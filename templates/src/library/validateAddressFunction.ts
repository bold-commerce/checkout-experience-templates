import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IAddress,
    IApiReturnObject,
    validateAddress,
} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEquals, validateAddressFields} from 'src/utils';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';
import {deleteAddress, postAddress} from 'src/library';
import {actionRemoveErrorByAddressType, actionSetAppStateValid} from 'src/action';

export function validateAddressFunction(type: string, address: Partial<IAddress>, libraryAddress: Partial<IAddress>) {
    return async function validateCustomerThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const generalSetting = getState().data.initial_data.general_settings.checkout_process;

        const validationField = ((
            {first_name, last_name, address_line_1, country_code, city}) => (
            {first_name, last_name, address_line_1, country_code, city}))(address);

        if(generalSetting?.phone_number_required) {
            validationField[Constants.ADDRESS_PHONE] = address.phone_number;
        }

        if(generalSetting?.company_name_option === 'required'){
            validationField[Constants.ADDRESS_BUSINESS] = address.business_name;
        }

        const validateAddressFunction = async () => {
            dispatch(actionRemoveErrorByAddressType(type));

            if (isObjectEquals(address, defaultAddressState) || !isObjectEquals(address, libraryAddress)) {
                const isAddressFieldsValidated = validateAddressFields(validationField, type, dispatch, getState);
                const response: IApiReturnObject = await validateAddress(
                    address.first_name as string,
                    address.last_name as string,
                    address.address_line_1 as string,
                    address.address_line_2 as string,
                    address.city as string,
                    address.postal_code as string,
                    address.province as string,
                    address.province_code as string,
                    address.country as string,
                    address.country_code as string,
                    address.business_name as string,
                    address.phone_number as string,
                    API_RETRY);
                handleErrorIfNeeded(response, dispatch, getState, type);
                const isAddressValidated = response.success;

                if (isAddressValidated && isAddressFieldsValidated) {
                    await dispatch(postAddress(type));
                } else if (type === Constants.SHIPPING) {
                    dispatch(actionSetAppStateValid('shippingAddress', false));
                } else if (type === Constants.BILLING){
                    dispatch(actionSetAppStateValid('billingAddress', false));
                }
            }

            if (!isObjectEquals(address, defaultAddressState) && isObjectEquals(address, libraryAddress)) {
                if (type === Constants.SHIPPING) {
                    dispatch(actionSetAppStateValid('shippingAddress', true));
                    dispatch(actionSetAppStateValid('updatedShippingAddress', true));
                } else if (type === Constants.BILLING){
                    dispatch(actionSetAppStateValid('billingAddress', true));
                }
            }
        };

        if(isObjectEquals(address, defaultAddressState) && !isObjectEquals(address, libraryAddress)){
            await dispatch(deleteAddress(type)).then( async () => {
                await validateAddressFunction();
            });
        } else {
            await validateAddressFunction();
        }
    };
}
