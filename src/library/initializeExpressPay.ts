import {Dispatch} from 'redux';
import {initialize} from '@boldcommerce/checkout-express-pay-library';
import {HistoryLocationState} from 'react-router';
import {IOrderInitialization} from 'src/types';
import {getExpressPayActions} from 'src/utils/getExpressPayActions';

export function initializeExpressPay(history: HistoryLocationState) {
    return async function initializeExpressPayThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const handleExpressPayActions = getExpressPayActions(dispatch, getState, history);
        initialize({onAction: handleExpressPayActions});
    };
}
