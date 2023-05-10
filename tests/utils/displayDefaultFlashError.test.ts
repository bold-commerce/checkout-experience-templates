import {displayDefaultFlashError} from 'src/utils';
import {errorSeverities, errorTypes} from 'src/constants';
import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';
import * as AppActions from 'src/action/appActionType';

describe('Test function displayDefaultFlashError', () => {
    const dispatchMock = jest.fn();

    test('displayDefaultFlashError should call the add_error action', () => {
        const apiError = {
            message: '',
            type: errorTypes.api,
            field: '',
            severity: errorSeverities.critical,
            sub_type: '',
        } as IApiErrorResponse;

        const expectedAction = {type: AppActions.ADD_ERROR, payload: apiError};

        displayDefaultFlashError(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(expectedAction);

    });
});
