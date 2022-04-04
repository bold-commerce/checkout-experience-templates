import {Dispatch} from 'redux';
import {IAddress, IOrderInitialization} from 'src/types';
import {
    IApiReturnObject,
    validateAddress,
} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEquals, validateAddressFields} from 'src/utils';
import {Constants, defaultAddressState} from 'src/constants';
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
            if (type === Constants.SHIPPING) {
                dispatch(actionRemoveErrorByAddressType(type));
            }

            if (isObjectEquals(address, defaultAddressState) || !isObjectEquals(address, libraryAddress)) {
                const isAddressFieldsValidated = validateAddressFields(validationField, type, dispatch);

                const response: IApiReturnObject = await validateAddress(address.postal_code as string, address.province as string, address.province_code as string, address.country as string, address.country_code as string, address.business_name as string);
                handleErrorIfNeeded(response, dispatch, getState, type);
                const isAddressValidated = response.success;

                if (isAddressValidated && isAddressFieldsValidated) {
                    await dispatch(postAddress(type));
                } else if (type === Constants.SHIPPING) {
                    dispatch(actionSetAppStateValid('shippingAddress', false));
                }
            }

            if (!isObjectEquals(address, defaultAddressState) && isObjectEquals(address, libraryAddress)) {
                dispatch(actionSetAppStateValid('shippingAddress', true));
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
