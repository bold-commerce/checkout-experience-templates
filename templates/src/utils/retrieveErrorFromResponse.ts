import {IApiErrorResponse, IApiErrorsResponse, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';

export function retrieveErrorFromResponse(response: IApiReturnObject): Array<IApiErrorResponse> {
    const {response: res} = response;
    let {errors} = res as {errors: Array<IApiErrorResponse>} || {};

    if (!errors) {
        const errorBody = response.error?.body as IApiErrorsResponse;
        if(errorBody?.errors) {
            errors = errorBody.errors;
        }
    }

    return errors;
}
