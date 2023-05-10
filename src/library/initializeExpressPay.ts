import {Dispatch} from 'redux';
import {actionAddError, actionSetAppStateValid, actionSetExpressPaymentSectionEnabled} from 'src/action';
import {initialize, actionTypes} from '@boldcommerce/checkout-express-pay-library';
import {findLanguageDataByIsoCode, getCheckoutUrl, getErrorTerm, getLanguageBlob} from 'src/utils';
import {Constants} from 'src/constants';
import {HistoryLocationState} from 'react-router';
import {displayOrderProcessingScreen, getApplicationStateFromLib, processOrder} from 'src/library';
import {IError, IOrderInitialization} from 'src/types';

export function initializeExpressPay(history: HistoryLocationState) {
    return async function initializeExpressPayThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const state = getState();
        const language = findLanguageDataByIsoCode(state.data.initial_data.supported_languages, state.appSetting.languageIso);
        let languageBlob;
        if (language) {
            languageBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_TYPE) as Array<Array<string>>;
        }
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
                case actionTypes.DISPLAY_ERROR: {
                    const message = payload['message'];
                    const details = payload['details'] ?? '';
                    const errorMessage =  getErrorTerm(details['term'] ?? '', details['section'] ?? '', languageBlob, message);
                    const error: IError = {
                        field: '', message: errorMessage, severity: '', sub_type: '', type: ''
                    };
                    dispatch(actionAddError(error));
                    break;
                }
                default:
                    break;
            }
        };
        initialize({onAction: handleExpressPayActions});
    };
}
