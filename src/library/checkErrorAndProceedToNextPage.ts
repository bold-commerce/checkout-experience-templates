import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionRemoveErrorByField, actionRemoveErrorByTypeAndCode, actionSetLoaderAndDisableButton} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {getCheckoutUrl, isOnlyDiscountCodeError} from 'src/utils';
import {errorFields, errorTypes} from 'src/constants';

export function checkErrorAndProceedToNextPage(page: string, loaderName: string, history: HistoryLocationState) {
    return async function checkErrorAndProceedToNextPageThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        dispatch(actionRemoveErrorByField(`${errorFields.discounts}`));
        dispatch(actionRemoveErrorByTypeAndCode(`${errorTypes.discount_code_validation}`, '02'));

        const {errors} = getState();
        dispatch(actionSetLoaderAndDisableButton(loaderName, false));

        if (errors.length <= 0 || isOnlyDiscountCodeError(errors)) {
            history.replace(getCheckoutUrl(page));
        }
    };
}
