import {sendEvents} from 'src/analytics';
import {actionAddError, actionClearErrors, actionShowHideOverlayContent} from 'src/action';
import {displayOrderProcessingScreen, processOrder, validateLifeFields} from 'src/library';
import {HistoryLocationState} from 'react-router';
import {Dispatch} from 'redux';
import {IOrderInitialization, ITokenizePayload, ITotals} from 'src/types';
import {
    baseReturnObject,
    FetchError,
    IApiErrorResponse,
    ILifeField
} from '@boldcommerce/checkout-frontend-library';
import {isOnlyFlashError} from 'src/utils/isOnlyFlashError';
import {retrieveErrorFromResponse} from 'src/utils/retrieveErrorFromResponse';

export function callEpsProcessOrder(history: HistoryLocationState, totals: ITotals, requiredLifeFields: Array<ILifeField>, thankYouPageLifeFields?: Array<ILifeField>, clientSecretToken?: string) {
    return async function callEpsProcessOrderThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        sendEvents('Clicked continue to complete order button', {'category': 'Checkout'});
        const state = getState();
        const appState = state.data.application_state;
        dispatch(actionClearErrors());
        if (state.appSetting.epsBoldPayment?.clearErrors) {
            state.appSetting.epsBoldPayment.clearErrors();
        }
        dispatch(validateLifeFields(requiredLifeFields, thankYouPageLifeFields));
        dispatch(displayOrderProcessingScreen);
        if (totals.totalAmountDue <= 0) {
            dispatch(processOrder(history, totals, requiredLifeFields, thankYouPageLifeFields));
        } else {
            if (state.appSetting.epsBoldPayment) {
                const requirements = state.appSetting.epsBoldPayment.getDataRequirements();
                const dataPayload: ITokenizePayload = {};
                requirements.forEach(rq => {
                    switch (rq) {
                        case 'customer':
                            dataPayload[rq] = {
                                first_name: appState.customer.first_name,
                                last_name: appState.customer.last_name,
                                email_address: appState.customer.email_address,
                            };
                            break;
                        case 'billing_address':
                            dataPayload[rq] = appState.addresses.billing;
                            break;
                        case 'shipping_address':
                            dataPayload[rq] = appState.addresses.shipping;
                            break;
                        case 'totals':
                            dataPayload[rq] = {
                                order_total: totals.totalOrder,
                                order_balance: totals.totalAmountDue,
                                shipping_total: appState.shipping.selected_shipping.amount,
                                discounts_total: totals.totalDiscounts,
                                fees_total: totals.totalFees,
                                taxes_total: totals.totalTaxes,
                            };
                            break;
                        case 'client_secret_token':
                            dataPayload[rq] = clientSecretToken;
                            break;
                    }
                });

                state.appSetting.epsBoldPayment.tokenize(dataPayload).then(() => {
                    dispatch(processOrder(history, totals, requiredLifeFields, thankYouPageLifeFields));
                }).catch((e) => {
                    const response = {...baseReturnObject};
                    response.error = e instanceof Error ? new FetchError(1, e.message) : (typeof e === 'string' ? new FetchError(1, e) : null);
                    const error = retrieveErrorFromResponse(response) as IApiErrorResponse;
                    if (isOnlyFlashError([error])) {
                        dispatch(actionAddError(error));
                    }
                    dispatch(actionShowHideOverlayContent(false));
                });
            }
        }
    };
}
