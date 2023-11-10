import {
    deleteAddress,
    displayOrderProcessingScreen,
    generateTaxes,
    getApplicationStateFromLib,
    getUpdatedApplicationState,
    processOrder,
    setDefaultAddresses,
} from 'src/library';
import {actionTypes, IOnAction} from '@boldcommerce/checkout-express-pay-library';
import {
    actionAddError,
    actionSetAppStateValid,
    actionSetExpressPaymentSectionEnabled,
} from 'src/action';
import {getCheckoutUrl} from 'src/utils/getCheckoutUrl';
import {Constants} from 'src/constants';
import {getErrorTerm} from 'src/utils/getErrorTerm';
import {IError, IOrderInitialization} from 'src/types';
import {Dispatch} from 'redux';
import {HistoryLocationState} from 'react-router';
import {findLanguageDataByIsoCode} from 'src/utils/findLanguageDataByIsoCode';
import {getLanguageBlob} from 'src/utils/getLanguageBlob';


export function getExpressPayActions(dispatch: Dispatch, getState: () => IOrderInitialization, history: HistoryLocationState): IOnAction {

    const state = getState();
    const language = findLanguageDataByIsoCode(state.data.initial_data.supported_languages, state.appSetting.languageIso);
    let languageBlob;
    if (language) {
        languageBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_TYPE) as Array<Array<string>>;
    }
    const resetOrder = async () => {
        await dispatch(deleteAddress(Constants.SHIPPING));
        await dispatch(deleteAddress(Constants.BILLING));
        await dispatch(generateTaxes);
        await dispatch(getUpdatedApplicationState);
    };

    const handleExpressPayActions = async (type, payload) => {
        await dispatch(getApplicationStateFromLib);
        switch (type) {
            case actionTypes.REFRESH_ORDER:
                await resetOrder();
                break;
            case actionTypes.ENABLE_DISABLE_SECTION:
                dispatch(actionSetExpressPaymentSectionEnabled(payload['show']));
                await dispatch(setDefaultAddresses);
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
                await resetOrder();
                break;
            }
            default:
                break;
        }
    };

    return handleExpressPayActions;
}
