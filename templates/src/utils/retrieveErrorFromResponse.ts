import {IApiErrorResponse, IApiErrorsResponse, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {errorSeverities, errorTypes} from 'src/constants';
import {INewApiErrorWarningResponse} from 'src/types';

export function retrieveErrorFromResponse(response: IApiReturnObject): Array<IApiErrorResponse> | IApiErrorResponse {
    const {response: res} = response;
    let {errors} = res as {errors: Array<IApiErrorResponse>} || {};

    //TODO - Remove or update that part once new error format is implemented! - CE-579 / CE-535 / CE-536
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (errors) {
        errors.forEach(newErrorsList => {
            const newErrors = newErrorsList as unknown as INewApiErrorWarningResponse;
            if (newErrors && newErrors.details) {
                if (Array.isArray(newErrors.details)) {
                    newErrors.details.forEach((e, index) => {
                        let message = '';
                        if (e.error_message) {
                            message = e.error_message;
                        } else if (e.warning_message) {
                            message = e.warning_message;
                        }

                        const err = {
                            message: message,
                            type: errorTypes.validation,
                            field: e.field,
                            severity: errorSeverities.validation,
                            sub_type: ''
                        } as IApiErrorResponse;
                        errors.splice(index, 1, err);

                    });
                } else {
                    let message = '';
                    const obj = newErrors.details;
                    if (obj.error_message) {
                        message = obj.error_message;
                    } else if (obj.warning_message) {
                        message = obj.warning_message;
                    }

                    const error = {
                        message: message,
                        type: errorTypes.validation,
                        field: obj.field,
                        severity: errorSeverities.validation,
                        sub_type: ''
                    } as IApiErrorResponse;
                    errors = [error];
                }
            }
        });
    }
    //END TODO CE-579 / CE-535 / CE-536

    if (!errors) {
        const errorBody = response.error?.body as IApiErrorsResponse;
        const errorMessage = !!response.error?.message;
        const errorStatus = !!response.error?.status;
        if(errorBody?.errors) {
            errors = errorBody.errors;
        } else if (errorMessage && errorStatus) {
            const apiError = {
                message: '',
                type: errorTypes.api,
                field: '',
                severity: errorSeverities.critical,
                sub_type: '',
            } as IApiErrorResponse;
            return apiError;
        }
    }

    return errors;
}
