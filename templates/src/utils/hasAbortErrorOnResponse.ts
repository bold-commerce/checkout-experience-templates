import {IApiReturnObject} from '@boldcommerce/checkout-frontend-library';

export function hasAbortErrorOnResponse(response: IApiReturnObject): boolean {
    const error = response.error?.metaData?.error;
    if (error && error instanceof Error) {
        return error.name === 'AbortError';
    }
    return false;
}
