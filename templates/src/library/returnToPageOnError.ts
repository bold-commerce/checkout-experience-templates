import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {getCheckoutUrl} from 'src/utils';

export function returnToPageOnError(page: string, loaderName: string, history: HistoryLocationState) {
    return async function returnToPageOnErrorThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const {errors} = getState();
        dispatch(actionSetLoaderAndDisableButton(loaderName, false));

        if (errors && errors.length > 0) {
            history.replace(getCheckoutUrl(page));
        }
    };
}
