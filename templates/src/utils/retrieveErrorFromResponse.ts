import {IApiErrorResponse, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';

export function retrieveErrorFromResponse(response: IApiReturnObject): Array<IApiErrorResponse> {
    const {response: res} = response;
    let {errors} = res as {errors: Array<IApiErrorResponse>} || {};

    if (!errors && response.error?.body?.errors) {
        errors = response.error.body.errors as Array<IApiErrorResponse>;
    }

    return errors;
}
