import  * as AppActions from './appActionType';
import {AnyAction} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {autocompleteServices} from 'src/constants';
import {
    IDiscount,
    IFees,
    ILineItem,
    IOrderMetaData,
    IPayment,
    IShippingLine,
    ITax,
    IExternalPaymentGateway
} from '@boldcommerce/checkout-frontend-library';

export function actionGetInitialData(url:string): AnyAction {
    return {
        type: AppActions.GET_INITIAL_DATA,
        payload: {
            storeName: url,
            screenWidth: window.innerWidth,
            autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE
        }
    };
}

/**
 * Update the width of the screen when width changes
 * @param width
 */
export function actionUpdateScreenWidth(width: number): AnyAction {
    return {
        type: AppActions.UPDATE_SCREEN_WIDTH,
        payload: width
    };
}

export function actionSetLanguageIso(languageIso: string): AnyAction {
    return {
        type: AppActions.SET_LANGUAGE_ISO,
        payload: {languageIso}
    };
}

export function actionSetCallApiOnEvent(callApiAtOnEvents: boolean): AnyAction {
    return {
        type: AppActions.SET_CALL_API_ON_EVENTS,
        payload: {callApiAtOnEvents}
    };
}

export function actionUpdateBillingTypeInSettings(type: string): AnyAction {
    return {
        type: AppActions.UPDATE_BILLING_TYPE,
        payload: {type}
    };
}

export function actionUpdateDiscountCodeText(code: string): AnyAction {
    return {
        type: AppActions.UPDATE_DISCOUNT_CODE_TEXT,
        payload: {code}
    };
}

export function actionSetLoaderAndDisableButton(field: string, value: boolean): (dispatch) => void {
    return dispatch => {
        dispatch(actionSetLoader(field, value));
        dispatch(actionSetButtonDisable(field, value));
    };
}

export function actionSetLoader(field: string, value: boolean): AnyAction {
    return {
        type: AppActions.SET_LOADER,
        payload: {field, value}
    };
}

export function actionSetButtonDisable(field: string, value: boolean): AnyAction {
    return {
        type: AppActions.SET_BUTTON_DISABLE,
        payload: {field, value}
    };
}

export function actionSetAppStateValid(field: string, value: boolean): AnyAction {
    return {
        type: AppActions.SET_VALID,
        payload: {field, value}
    };
}

export function actionSetExternalGatewayReady(gateway: IExternalPaymentGateway, value: boolean): AnyAction {
    return {
        type: AppActions.SET_EXTERNAL_PAYMENT_GATEWAY_VALID,
        payload: {value, gateway}
    };
}

export function actionSetPigiIframeLoader(pigiIframeLoader: boolean): AnyAction {
    return {
        type: AppActions.SET_PIGI_IFRAME_LOADER,
        payload: {pigiIframeLoader}
    };
}

export function actionSetExternalPaymentGatewayLoading(gateway: IExternalPaymentGateway, value: boolean): AnyAction {
    return {
        type: AppActions.SET_EXTERNAL_PAYMENT_GATEWAY_LOADING,
        payload: {value, gateway}
    };
}

export function actionSetPigiDisplaySca(pigiDisplaySca: boolean): AnyAction {
    return {
        type: AppActions.SET_PIGI_DISPLAY_SCA,
        payload: {pigiDisplaySca}
    };
}

export function actionSetExpressPaymentSectionEnabled(isExpressPaySectionEnable: boolean): AnyAction {
    return {
        type: AppActions.SET_EXPRESS_PAYMENT_SECTION_ENABLED,
        payload: {isExpressPaySectionEnable}
    };
}


export function actionAddDiscount(code: string, value: number, text: string): AnyAction {
    return {
        type:AppActions.ADD_DISCOUNT,
        payload: {
            code: code ? code : 'NEW_DISCOUNT',
            text: text,
            value: value,
            valid: code !== undefined && code !== null && code !== ''
        }
    };
}

export function actionRemoveDiscount(code?: string): AnyAction {
    return {
        type:AppActions.REMOVE_DISCOUNT,
        payload: {
            code: code ? code : 'NEW_DISCOUNT'
        }
    };
}

export function actionSetSelectedShippingLine(line: IShippingLine): AnyAction {
    return {
        type: AppActions.SET_SELECTED_SHIPPING_LINE,
        payload: {line}
    };
}

export function actionUpdateLineItem(line: Array<ILineItem>): AnyAction {
    return {
        type: AppActions.UPDATE_LINE_ITEMS,
        payload: {line}
    };
}

export function actionUpdateTaxes(data: Array<ITax>): AnyAction {
    return {
        type: AppActions.UPDATE_TAXES,
        payload: {data}
    };
}

export function actionOrderTotal(data: number): AnyAction {
    return {
        type: AppActions.UPDATE_ORDER_TOTAL,
        payload: {data}
    };
}

export function actionUpdateDiscounts(data: Array<IDiscount>): AnyAction {
    return {
        type: AppActions.UPDATE_DISCOUNTS,
        payload: {data}
    };
}

export function actionUpdateFees(data: Array<IFees>): AnyAction {
    return {
        type: AppActions.UPDATE_FEES,
        payload: {data}
    };
}

export function actionUpdatePayments(data: Array<IPayment>): AnyAction {
    return {
        type: AppActions.UPDATE_PAYMENT,
        payload: {data}
    };
}

export function actionOrderMetaData(data: IOrderMetaData): AnyAction {
    return {
        type: AppActions.UPDATE_ORDER_META_DATA,
        payload: {data}
    };
}

export function actionUpdateSelectedShippingLine(data: Partial<IShippingLine>): AnyAction {
    return {
        type: AppActions.UPDATE_SELECTED_SHIPPING_LINE,
        payload: {data}
    };
}

export function actionUpdateAvailableShippingLines(data: Array<IShippingLine>): AnyAction {
    return {
        type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
        payload: {data}
    };
}

export function actionUpdateShippingLinesTaxes(data: Array<ITax>): AnyAction {
    return {
        type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
        payload: {data}
    };
}

export function actionUpdateShippingLinesDiscount(data: Array<IDiscount>): AnyAction {
    return {
        type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
        payload: {data}
    };
}

export function actionRemoveErrorByField(field: string, addressType = ''): AnyAction {
    return {
        type: AppActions.REMOVE_ERROR_BY_FIELD,
        payload: {field, addressType}
    };
}

export function actionRemoveErrorByType(type: string, addressType = ''): AnyAction {
    return {
        type: AppActions.REMOVE_ERROR_BY_TYPE,
        payload: {type, addressType}
    };
}

export function actionRemoveErrorByTypeAndCode(type: string, code: string, addressType = ''): AnyAction {
    return {
        type: AppActions.REMOVE_ERROR_BY_TYPE_AND_CODE,
        payload: {type, code, addressType}
    };
}

export function actionRemoveErrorByAddressType(addressType = ''): AnyAction {
    return {
        type: AppActions.REMOVE_ERROR_BY_ADDRESS_TYPE,
        payload: {addressType}
    };
}

export function actionAddError(error: IError): AnyAction {
    return {
        type: AppActions.ADD_ERROR,
        payload: error
    };
}

export function actionRemoveError(error: IError): AnyAction {
    return {
        type: AppActions.REMOVE_ERROR,
        payload: error
    };
}

export function actionClearErrors(): AnyAction {
    return {
        type: AppActions.CLEAR_ERRORS
    };
}

export function actionUpdateAppData(data: IOrderInitialization): AnyAction {
    return {
        type: AppActions.UPDATE_APP_DATA,
        payload: {data},
    };
}

export function actionUpdateIsProcessedOrder(data: boolean): AnyAction {
    return {
        type: AppActions.UPDATE_ORDER_PROCESSED,
        payload: {data},
    };
}

export function actionClearValidStates(): AnyAction {
    return {
        type: AppActions.CLEAR_VALID_STATES
    };
}

export function actionSetSessionInitialized(data: boolean): AnyAction {
    return {
        type: AppActions.SET_SESSION_INITIALIZED,
        payload: {data},
    };
}
