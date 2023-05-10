import {IApiReturnObject, initialize} from '@boldcommerce/checkout-frontend-library';
import {displayFatalErrorFromTranslation, handleErrorIfNeeded} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionSetSessionInitialized} from 'src/action';

export async function initializeSession(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void>{
    const state = getState();
    const response:IApiReturnObject = await initialize(state.data,
        window.shopIdentifier,
        window.environment);

    handleErrorIfNeeded(response, dispatch, getState);

    if(!response.success){
        displayFatalErrorFromTranslation(state, dispatch);
    } else {
        dispatch(actionSetSessionInitialized(true));
    }
}
