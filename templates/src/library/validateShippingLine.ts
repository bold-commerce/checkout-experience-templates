import {IError, IOrderInitialization} from 'src/types';
import {Dispatch} from 'redux';
import {errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {actionAddError, actionRemoveErrorByType, actionSetAppStateValid} from 'src/action';

export async function validateShippingLine(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const {data: {application_state: {shipping: {selected_shipping}}}} = getState();
    await dispatch(actionRemoveErrorByType(errorTypes.shipping_line));

    if (!selected_shipping || selected_shipping.id === null || selected_shipping.id === undefined || selected_shipping.id === ''){
        const error : IError = {
            message: 'No shipping method selected',
            type: errorTypes.shipping_line,
            field: errorFields.id,
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.empty,
            address_type: '',
        };
        await dispatch(actionAddError(error));
        await dispatch(actionSetAppStateValid('shippingLine', false));
    } else {
        await dispatch(actionSetAppStateValid('shippingLine', true));
    }
}
