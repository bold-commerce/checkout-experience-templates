import {Dispatch} from 'redux';
import {actionSetAppStateValid, actionSetExpressPaymentSectionEnabled} from 'src/action';
import {initialize, actionTypes} from '@bold-commerce/checkout-express-pay-library';
import {getCheckoutUrl, getHook} from 'src/utils';
import {Constants} from 'src/constants';
import {HistoryLocationState} from 'react-router';
import {displayOrderProcessingScreen, getApplicationStateFromLib, processOrder} from 'src/library';

export function initializeExpressPay(dispatch: Dispatch): void {

    const history: HistoryLocationState = getHook('history');
    const handleExpressPayActions = async (type, payload) => {
        await dispatch(getApplicationStateFromLib);
        switch (type) {
            case actionTypes.ENABLE_DISABLE_SECTION:
                dispatch(actionSetExpressPaymentSectionEnabled(payload['show']));
                break;
            case actionTypes.ORDER_COMPLETED:
                dispatch(actionSetAppStateValid('orderProcessed', true));
                history.replace(getCheckoutUrl(Constants.THANK_YOU_ROUTE));
                break;
            case actionTypes.ORDER_PROCESSING:
                dispatch(displayOrderProcessingScreen);
                await dispatch(processOrder(history));
                break;
            default:
                break;
        }
    };
    initialize({onAction: handleExpressPayActions});
}
