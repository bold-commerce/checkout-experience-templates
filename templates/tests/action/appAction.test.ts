import {
    actionAddDiscount,
    actionAddError,
    actionClearErrors,
    actionGetInitialData,
    actionOrderMetaData,
    actionOrderTotal,
    actionRemoveDiscount,
    actionRemoveError,
    actionRemoveErrorByAddressType,
    actionRemoveErrorByField,
    actionRemoveErrorByType,
    actionRemoveErrorByTypeAndCode,
    actionSetAppStateValid,
    actionSetCallApiOnEvent,
    actionSetSessionInitialized,
    actionSetLanguageIso,
    actionSetLoader,
    actionSetLoaderAndDisableButton,
    actionSetPigiDisplaySca,
    actionSetPigiIframeLoader,
    actionSetSelectedShippingLine,
    actionUpdateAppData,
    actionUpdateAvailableShippingLines,
    actionUpdateBillingTypeInSettings,
    actionUpdateDiscountCodeText,
    actionUpdateDiscounts,
    actionUpdateFees,
    actionUpdateIsProcessedOrder,
    actionUpdateLineItem,
    actionUpdatePayments,
    actionUpdateScreenWidth,
    actionUpdateSelectedShippingLine,
    actionUpdateShippingLinesDiscount,
    actionUpdateShippingLinesTaxes,
    actionUpdateTaxes,
    actionSetExternalPaymentGatewayLoading,
    actionSetExternalGatewayReady,
} from 'src/action';
import * as AppActions from 'src/action/appActionType';
import {autocompleteServices} from 'src/constants';
import {initialDataMock, stateMock} from 'src/mocks';
import {IError, IOrderInitialization} from 'src/types';
import {ILineItem, IShippingLine, IExternalPaymentGateway} from '@boldcommerce/checkout-frontend-library';
import {feesMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

describe('Testing App Actions', () => {

    test('actionGetInitialData', () => {
        const urlTest = 'https://someurl.test';
        const actionReturnExpectation = {
            type: AppActions.GET_INITIAL_DATA,
            payload: {
                storeName: urlTest,
                screenWidth: window.innerWidth,
                autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE
            }
        };

        const result = actionGetInitialData(urlTest);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateScreenWidth', () => {
        const width = 1234;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_SCREEN_WIDTH,
            payload: width
        };

        const result = actionUpdateScreenWidth(width);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetLanguageIso', () => {
        const languageIso = 'en';
        const actionReturnExpectation = {
            type: AppActions.SET_LANGUAGE_ISO,
            payload: {languageIso}
        };

        const result = actionSetLanguageIso(languageIso);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetCallApiOnEvent', () => {
        const callApiAtOnEvents = true;
        const actionReturnExpectation = {
            type: AppActions.SET_CALL_API_ON_EVENTS,
            payload: {callApiAtOnEvents}
        };

        const result = actionSetCallApiOnEvent(callApiAtOnEvents);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateBillingTypeInSettings', () => {
        const type = 'same';
        const actionReturnExpectation = {
            type: AppActions.UPDATE_BILLING_TYPE,
            payload: {type}
        };

        const result = actionUpdateBillingTypeInSettings(type);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateDiscountCodeText', () => {
        const code = 'test';
        const actionReturnExpectation = {
            type: AppActions.UPDATE_DISCOUNT_CODE_TEXT,
            payload: {code}
        };

        const result = actionUpdateDiscountCodeText(code);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetLoader', () => {
        const field = 'some_field';
        const value = true;
        const actionReturnExpectation = {
            type: AppActions.SET_LOADER,
            payload: {field, value}
        };

        const result = actionSetLoader(field, value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetAppStateValid', () => {
        const field = 'some_field';
        const value = true;
        const actionReturnExpectation = {
            type: AppActions.SET_VALID,
            payload: {field, value}
        };

        const result = actionSetAppStateValid(field, value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetPigiIframeLoader', () => {
        const pigiIframeLoader = true;
        const actionReturnExpectation = {
            type: AppActions.SET_PIGI_IFRAME_LOADER,
            payload: {pigiIframeLoader}
        };

        const result = actionSetPigiIframeLoader(pigiIframeLoader);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetExternalGatewayLoading', () => {
        const loading = true;
        const gateway: IExternalPaymentGateway = {
            base_url: '', iframe_url: '', is_test: false, location: '', public_id: '', target_div: '', currency: ''
        };
        const actionReturnExpectation = {
            type: AppActions.SET_EXTERNAL_PAYMENT_GATEWAY_LOADING,
            payload: {gateway, value: true}
        };

        const result = actionSetExternalPaymentGatewayLoading(gateway, loading);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetAppExternalGatewayStateValid', () => {
        const loading = true;
        const gateway: IExternalPaymentGateway = {
            base_url: '', iframe_url: '', is_test: false, location: '', public_id: '', target_div: '', currency: ''
        };
        const actionReturnExpectation = {
            type: AppActions.SET_EXTERNAL_PAYMENT_GATEWAY_VALID,
            payload: {gateway, value: true}
        };

        const result = actionSetExternalGatewayReady(gateway, loading);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetPigiDisplaySca', () => {
        const pigiDisplaySca = true;
        const actionReturnExpectation = {
            type: AppActions.SET_PIGI_DISPLAY_SCA,
            payload: {pigiDisplaySca}
        };

        const result = actionSetPigiDisplaySca(pigiDisplaySca);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionAddDiscount', () => {
        const code = 'test';
        const value = 100;
        const text = 'test';
        const actionReturnExpectation = {
            type:AppActions.ADD_DISCOUNT,
            payload: {
                code: code,
                text: text,
                value: value,
                valid: true
            }
        };

        const result = actionAddDiscount(code, value, text);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionAddDiscount no code', () => {
        const code = '';
        const value = 100;
        const text = 'test';
        const actionReturnExpectation = {
            type:AppActions.ADD_DISCOUNT,
            payload: {
                code: 'NEW_DISCOUNT',
                text: text,
                value: value,
                valid: false
            }
        };

        const result = actionAddDiscount(code, value, text);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveDiscount', () => {
        const code = 'test';
        const actionReturnExpectation = {
            type:AppActions.REMOVE_DISCOUNT,
            payload: {
                code: code
            }
        };

        const result = actionRemoveDiscount(code);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveDiscount no code', () => {
        const actionReturnExpectation = {
            type:AppActions.REMOVE_DISCOUNT,
            payload: {
                code: 'NEW_DISCOUNT'
            }
        };

        const result = actionRemoveDiscount();

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetSelectedShippingLine', () => {
        const line = initialDataMock.application_state.shipping.selected_shipping as IShippingLine;
        const actionReturnExpectation = {
            type: AppActions.SET_SELECTED_SHIPPING_LINE,
            payload: {line}
        };

        const result = actionSetSelectedShippingLine(line);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateLineItem', () => {
        const line = [initialDataMock.application_state.line_items[0] as ILineItem];
        const actionReturnExpectation = {
            type: AppActions.UPDATE_LINE_ITEMS,
            payload: {line}
        };

        const result = actionUpdateLineItem(line);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateTaxes', () => {
        const data = initialDataMock.application_state.taxes;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_TAXES,
            payload: {data}
        };

        const result = actionUpdateTaxes(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionOrderTotal', () => {
        const data = initialDataMock.application_state.order_total;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_ORDER_TOTAL,
            payload: {data}
        };

        const result = actionOrderTotal(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateDiscounts', () => {
        const data = initialDataMock.application_state.discounts;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_DISCOUNTS,
            payload: {data}
        };

        const result = actionUpdateDiscounts(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateFees', () => {
        const data = [feesMock];
        const actionReturnExpectation = {
            type: AppActions.UPDATE_FEES,
            payload: {data}
        };

        const result = actionUpdateFees(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdatePayments', () => {
        const data = initialDataMock.application_state.payments;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_PAYMENT,
            payload: {data}
        };

        const result = actionUpdatePayments(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionOrderMetaData', () => {
        const data = initialDataMock.application_state.order_meta_data;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_ORDER_META_DATA,
            payload: {data}
        };

        const result = actionOrderMetaData(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateSelectedShippingLine', () => {
        const data = initialDataMock.application_state.shipping.selected_shipping;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_SELECTED_SHIPPING_LINE,
            payload: {data}
        };

        const result = actionUpdateSelectedShippingLine(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateAvailableShippingLines', () => {
        const data = initialDataMock.application_state.shipping.available_shipping_lines;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
            payload: {data}
        };

        const result = actionUpdateAvailableShippingLines(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateShippingLinesTaxes', () => {
        const data = initialDataMock.application_state.shipping.taxes;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
            payload: {data}
        };

        const result = actionUpdateShippingLinesTaxes(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateShippingLinesDiscount', () => {
        const data = initialDataMock.application_state.shipping.discounts;
        const actionReturnExpectation = {
            type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
            payload: {data}
        };

        const result = actionUpdateShippingLinesDiscount(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByField empty AddressType', () => {
        const field = 'test_field';
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_FIELD,
            payload: {field, addressType}
        };

        const result = actionRemoveErrorByField(field);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByField', () => {
        const field = 'test_field';
        const addressType = 'billing';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_FIELD,
            payload: {field, addressType}
        };

        const result = actionRemoveErrorByField(field, addressType);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByType empty AddressType', () => {
        const type = 'test_type';
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_TYPE,
            payload: {type, addressType}
        };

        const result = actionRemoveErrorByType(type);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByType', () => {
        const type = 'test_type';
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_TYPE,
            payload: {type, addressType}
        };

        const result = actionRemoveErrorByType(type, addressType);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByTypeAndCode empty AddressType', () => {
        const type = 'test_type';
        const code = 'test_code';
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_TYPE_AND_CODE,
            payload: {type, code, addressType}
        };

        const result = actionRemoveErrorByTypeAndCode(type, code);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByTypeAndCode', () => {
        const type = 'test_type';
        const code = 'test_code';
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_TYPE_AND_CODE,
            payload: {code, type, addressType}
        };

        const result = actionRemoveErrorByTypeAndCode(type, code, addressType);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByAddressType empty AddressType', () => {
        const addressType = '';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_ADDRESS_TYPE,
            payload: {addressType}
        };

        const result = actionRemoveErrorByAddressType();

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveErrorByAddressType', () => {
        const addressType = 'billing';
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR_BY_ADDRESS_TYPE,
            payload: {addressType}
        };

        const result = actionRemoveErrorByAddressType(addressType);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionAddError', () => {
        const error: IError = {
            address_type: 'billing',
            message: 'some error message',
            type: 'some_type',
            field: 'some_field',
            sub_type: 'some_subtype',
            severity: 'some_severity'
        };
        const actionReturnExpectation = {
            type: AppActions.ADD_ERROR,
            payload: error
        };

        const result = actionAddError(error);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionRemoveError', () => {
        const error: IError = {
            address_type: 'billing',
            message: 'some error message',
            type: 'some_type',
            field: 'some_field',
            sub_type: 'some_subtype',
            severity: 'some_severity'
        };
        const actionReturnExpectation = {
            type: AppActions.REMOVE_ERROR,
            payload: error
        };

        const result = actionRemoveError(error);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetLoaderAndDisableButton', () => {
        const field = 'test';
        const value = true;
        const firstReturnedValues = {
            type: AppActions.SET_LOADER,
            payload: {field, value}
        };
        const secondReturnedValues = {
            type: AppActions.SET_BUTTON_DISABLE,
            payload: {field, value}
        };
        const dispatch = jest.fn();

        actionSetLoaderAndDisableButton(field, value)(dispatch);

        expect(dispatch.mock.calls.length).toBe(2);
        expect(dispatch.mock.calls[0][0]).toStrictEqual(firstReturnedValues);
        expect(dispatch.mock.calls[1][0]).toStrictEqual(secondReturnedValues);
    });

    test('actionUpdateAppData', () => {
        const data: IOrderInitialization = stateMock;

        const actionReturnExpectation = {
            type: AppActions.UPDATE_APP_DATA,
            payload: {data}
        };

        const result = actionUpdateAppData(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateAppData', () => {
        const data = true;

        const actionReturnExpectation = {
            type: AppActions.UPDATE_ORDER_PROCESSED,
            payload: {data}
        };

        const result = actionUpdateIsProcessedOrder(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateAppData', () => {
        const actionReturnExpectation = {
            type: AppActions.CLEAR_ERRORS,
        };

        const result = actionClearErrors();

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionSetSessionInitialized', () => {
        const data = true;
        const actionReturnExpectation = {
            type: AppActions.SET_SESSION_INITIALIZED,
            payload: {data}
        };

        const result = actionSetSessionInitialized(data);
        
        expect(result).toStrictEqual(actionReturnExpectation);
    });

});
