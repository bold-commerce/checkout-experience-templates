import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    apiTypeKeys,
    IAddress,
    IBatchableRequest,
} from '@boldcommerce/checkout-frontend-library';
import {isObjectEquals, validateAddressFields} from 'src/utils';
import {API_RETRY, Constants, defaultAddressState} from 'src/constants';
import {getPayloadForPostShippingAddress, getPayloadForPostBillingAddress} from 'src/library';
import {actionRemoveErrorByAddressType} from 'src/action';

export function validateAddressFunctionV2(type: string, address: Partial<IAddress>, libraryAddress: Partial<IAddress>) {
    return function validateCustomerThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Array<IBatchableRequest> {
        const batch :  Array<IBatchableRequest> = [];
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

        dispatch(actionRemoveErrorByAddressType(type));

        if (isObjectEquals(address, defaultAddressState) || !isObjectEquals(address, libraryAddress)) {
            const isAddressFieldsValidated = validateAddressFields(validationField, type, dispatch, getState);

            if(isAddressFieldsValidated) {
                if (type === Constants.SHIPPING) {
                    const postShippingBatch = getPayloadForPostShippingAddress(dispatch, getState);
                    if (postShippingBatch) {
                        batch.push(postShippingBatch);
                    }
                } else {
                    const postBillingBatch = getPayloadForPostBillingAddress(dispatch, getState);
                    if (postBillingBatch) {
                        batch.push(postBillingBatch);
                    }
                }
            }
        }

        if(isObjectEquals(address, defaultAddressState) && !isObjectEquals(address, libraryAddress)){
            if(type === Constants.SHIPPING) {
                const deleteShippingBatch : IBatchableRequest = {apiType:apiTypeKeys.deleteShippingAddress, payload:{API_RETRY}};
                batch.push(deleteShippingBatch);
            } else {
                const deleteBillingBatch : IBatchableRequest = {apiType:apiTypeKeys.deleteBillingAddress, payload:{API_RETRY}};
                batch.push(deleteBillingBatch);
            }
        }
        return batch;
    };
}
