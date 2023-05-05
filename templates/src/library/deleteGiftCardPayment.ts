import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {deleteGiftCardPayment as deleteGiftCardPaymentLib, IApiReturnObject, IPayment} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getSummaryStateFromLib} from 'src/library';
import {actionDeleteElement, actionSetLoaderAndDisableButton, REMOVE_PAYMENT} from 'src/action';
import {API_RETRY} from 'src/constants';

export function deleteGiftCardPayment(giftCardId: string) {
    return async function deleteGiftCardPaymentThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        const {payments} = state.data.application_state;
        const payment: IPayment | undefined = payments.find(item => item.id === giftCardId);
        const {type, id} = payment || {};

        if (id && type && type.toLowerCase().replace(/\s|_/g, '').includes('giftcard')) {
            const response: IApiReturnObject = await deleteGiftCardPaymentLib(id, API_RETRY);
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
