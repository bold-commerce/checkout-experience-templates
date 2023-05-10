import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {deletePayment as deletePaymentLib, IApiReturnObject, IPayment} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';
import {actionDeleteElement, actionSetLoaderAndDisableButton, REMOVE_PAYMENT} from 'src/action';
import {API_RETRY} from 'src/constants';

export function deletePayment(id: string) {
    return async function deletePaymentThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        const {payments} = state.data.application_state;
        const payment: IPayment | undefined = payments.find(item => item.id === id);
        const {gateway_public_id, token} = payment || {};

        if (gateway_public_id && token) {
            const response: IApiReturnObject = await deletePaymentLib({gateway_public_id, token}, API_RETRY);
            handleErrorIfNeeded(response, dispatch, getState);

            if(response.success) {
                await dispatch(getSummaryStateFromLib);
                const action = actionDeleteElement(REMOVE_PAYMENT, id);
                action && dispatch(action);
            }
        }

        dispatch(actionSetLoaderAndDisableButton('paymentClose' , false));
    };
}
