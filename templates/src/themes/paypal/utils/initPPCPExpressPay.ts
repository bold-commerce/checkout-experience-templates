import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getExpressPayActions} from 'src/utils/getExpressPayActions';
import {HistoryLocationState} from 'react-router';
//import {initPpcp} from '@boldcommerce/checkout-express-pay-library';

export function initializePPCPExpressPay(history: HistoryLocationState) {
    return async function initializeExpressPayThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {

        // TODO: Remove the disabled lint comment after implementation is done.
        // eslint-disable-next-line
        const onAction = getExpressPayActions(dispatch, getState, history);
        //initPpcp(onAction);

    };
}
