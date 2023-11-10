import {IApiErrorsResponse, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {IMetaPaymentDataError} from 'src/themes/flow-sdk/types';
import {getErrorWithField} from './getErrorWithField';

export function getErrorFromResponse(libResponse: IApiReturnObject, baseError: IMetaPaymentDataError): IMetaPaymentDataError {
    const response = libResponse?.response as IApiErrorsResponse;
    if (response?.errors && Array.isArray(response?.errors)) {
        return getErrorWithField(response?.errors, baseError);
    } else {
        return baseError;
    }    
}