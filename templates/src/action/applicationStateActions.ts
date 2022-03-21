import {AnyAction} from 'redux';
import {REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action/appActionType';

function actionDeletePayment (id: string): AnyAction{
    return {
        type: REMOVE_PAYMENT,
        payload: {id: id}
    };
}

function actionDeleteDiscount (code: string): AnyAction{
    return {
        type: REMOVE_DISCOUNT,
        payload: {code: code}
    };
}

export function actionDeleteElement(eventName: string, idToDelete: string): void | AnyAction {
    if (eventName && idToDelete) {
        switch (eventName) {
            case REMOVE_DISCOUNT:
                return actionDeleteDiscount(idToDelete);
            case REMOVE_PAYMENT:
                return actionDeletePayment(idToDelete);
            default:
                break;
        }
    }
}
