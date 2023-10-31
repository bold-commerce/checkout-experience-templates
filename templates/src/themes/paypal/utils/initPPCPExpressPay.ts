import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getExpressPayActions} from 'src/utils/getExpressPayActions';
import {HistoryLocationState} from 'react-router';
import {initPpcp} from '@boldcommerce/checkout-express-pay-library';

export function initializePPCPExpressPay(history: HistoryLocationState) {
    return async function initializeExpressPayThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {

        const onAction = getExpressPayActions(dispatch, getState, history);
        await initPpcp(onAction);

    };
}
