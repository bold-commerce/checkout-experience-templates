import {actionAddError} from 'src/action';
import {Dispatch} from 'redux';
import {errorSeverities, errorTypes} from 'src/constants';
import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';

export function displayDefaultFlashError(dispatch: Dispatch): void{
    const apiError = {
        message: '',
        type: errorTypes.api,
        field: '',
        severity: errorSeverities.critical,
        sub_type: '',
    } as IApiErrorResponse;
    dispatch(actionAddError(apiError));
}
