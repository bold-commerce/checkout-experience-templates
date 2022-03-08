import {orderInitialization} from 'src/constants/orderInitialization';
import {IIsLoading} from 'src/types';
import {SET_LOADER, SET_PIGI_IFRAME_LOADER} from 'src/action/appActionType';
import {AnyAction} from 'redux';

const {isLoading} = orderInitialization;

export function loadingReducer(state = isLoading, action: AnyAction): IIsLoading {

    switch (action.type) {
        case SET_LOADER:
            return {...state, [action.payload.field]: action.payload.value};
        case SET_PIGI_IFRAME_LOADER:
            return {...state, pigiIframe: action.payload.pigiIframeLoader};
        default:
            return state;
    }
}
