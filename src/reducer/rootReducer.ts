import * as AppActionsType from '../action/appActionType';
import {AnyAction, combineReducers} from 'redux';
import {IInitialState, IOrderInitialization} from 'src/types';
import {
    availableShippingLinesReducer,
    billingReducer,
    countryReducer,
    customerReducer,
    discountsReducer,
    errorsReducer,
    externalPaymentGatewaysReducer,
    externalPaymentGatewayInitialDataReducer,
    jwtTokenReducer,
    languageReducer,
    lineItemsReducer,
    loadingReducer,
    orderTotalReducer,
    overlayReducer,
    paymentsReducer,
    publicOrderIdReducer,
    selectShippingLineReducer,
    shippingLineItemDiscountReducer,
    shippingLineItemTaxesReducer,
    shippingReducer,
    shopNameReducer,
    taxesReducer,
    validReducer,
    buttonDisableReducer,
    addressAutoCompleteReducer,
    checkoutProcessReducer,
    createdViaReducer,
    resumableLinkReducer,
    currencyReducer,
    isProcessedReducer,
    feesReducer,
    sessionInitializedReducer,
    lifeFieldsInitialDataReducer,
    linkToCartReducer,
    flowSettingsInitialDataReducer,
    noteAttributesReducer,
    cartParametersReducer,
    notesReducer,
    tagsReducer,
    requiresShippingDataReducer,
    displayExchangeRateReducer,
    displayCurrencyReducer,
    flowIdReducer,
    vaultingEnabledDataReducer,
} from 'src/reducer';
import {autocompleteServices, Constants} from 'src/constants';
import {defaultOrderInitialization} from 'src/constants/orderInitialization';
import {orderBalanceReducer} from 'src/reducer/orderBalanceReducer';
import {epsGatewaysReducer} from 'src/reducer/epsGatewaysReducer';
import {fraudToolsInitialDataReducer} from 'src/reducer/fraudToolsInitialDataReducer';

export const initialState: IInitialState = {
    screenWidth: window.innerWidth,
    languageIso: 'en',
    autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE,
    callApiAtOnEvents: false,
    billingType: Constants.SHIPPING_SAME,
    discountText: '',
    isExpressPaySectionEnable: false,
    isOnePageTheme: false,
    allowNavigation: false,
    paymentComponentType: Constants.EPS,
    epsBoldPayment: null,
};

export function appSettingReducer(state = initialState, action: AnyAction): IInitialState {
    switch (action.type) {
        case AppActionsType.GET_INITIAL_DATA:
            return {...state};
        case AppActionsType.SET_LANGUAGE_ISO:
            return {...state, languageIso: action.payload.languageIso};
        case AppActionsType.SET_CALL_API_ON_EVENTS:
            return {...state, callApiAtOnEvents: action.payload.callApiAtOnEvents};
        case AppActionsType.UPDATE_SCREEN_WIDTH:
            return <IInitialState>{...state, screenWidth: action.payload};
        case AppActionsType.UPDATE_BILLING_TYPE:
            return {...state, billingType: action.payload.type};
        case AppActionsType.UPDATE_DISCOUNT_CODE_TEXT:
            return {...state, discountText: action.payload.code};
        case AppActionsType.SET_EXPRESS_PAYMENT_SECTION_ENABLED:
            return {...state, isExpressPaySectionEnable: action.payload.isExpressPaySectionEnable};
        case AppActionsType.SET_ONE_PAGE_THEME:
            return {...state, isOnePageTheme: action.payload.isOnePageTheme};
        case AppActionsType.SET_ALLOW_NAVIGATION:
            return {...state, allowNavigation: true};
        case AppActionsType.UPDATE_PAYMENT_COMPONENT_TYPE:
            return {...state, paymentComponentType: action.payload.paymentComponentType};
        case AppActionsType.UPDATE_EPS_BOLD_PAYMENT:
            return {...state, epsBoldPayment: action.payload};
        default:
            return state;
    }
}

const addressReducer = combineReducers({
    shipping: shippingReducer,
    billing: billingReducer
});

const shippingOptionsReducer = combineReducers({
    selected_shipping: selectShippingLineReducer,
    available_shipping_lines: availableShippingLinesReducer,
    taxes: shippingLineItemTaxesReducer,
    discounts: shippingLineItemDiscountReducer
});

const orderMetaReducer = combineReducers({
    cart_parameters: cartParametersReducer,
    note_attributes: noteAttributesReducer,
    notes: notesReducer,
    tags: tagsReducer
});

const appStateReducer = combineReducers({
    customer: customerReducer,
    addresses: addressReducer,
    line_items: lineItemsReducer,
    shipping: shippingOptionsReducer,
    taxes: taxesReducer,
    order_total:orderTotalReducer,
    order_balance:orderBalanceReducer,
    discounts: discountsReducer,
    payments: paymentsReducer,
    order_meta_data: orderMetaReducer,
    resumable_link: resumableLinkReducer,
    currency: currencyReducer,
    display_currency: displayCurrencyReducer,
    display_exchange_rate: displayExchangeRateReducer,
    created_via: createdViaReducer,
    is_processed: isProcessedReducer,
    fees: feesReducer,
    link_to_cart: linkToCartReducer,
    flow_id: flowIdReducer,
});

const generalSettingReducer = combineReducers({
    checkout_process: checkoutProcessReducer,
    address_autocomplete: addressAutoCompleteReducer
});

const initialDataReducer = combineReducers({
    shop_name: shopNameReducer,
    country_info: countryReducer,
    supported_languages: languageReducer,
    general_settings: generalSettingReducer,
    external_payment_gateways: externalPaymentGatewayInitialDataReducer,
    life_elements: lifeFieldsInitialDataReducer,
    fraud_tools: fraudToolsInitialDataReducer,
    flow_settings: flowSettingsInitialDataReducer,
    requires_shipping: requiresShippingDataReducer,
    eps_gateways: epsGatewaysReducer,
});

const dataReducer = combineReducers({
    jwt_token: jwtTokenReducer,
    public_order_id: publicOrderIdReducer,
    application_state: appStateReducer,
    initial_data: initialDataReducer,
    vaulting_enabled: vaultingEnabledDataReducer,
});

const allReducers = combineReducers({
    appSetting: appSettingReducer,
    isLoading: loadingReducer,
    externalPaymentGateways: externalPaymentGatewaysReducer,
    isButtonDisable: buttonDisableReducer,
    isValid: validReducer,
    isSessionInitialized: sessionInitializedReducer,
    overlay: overlayReducer,
    errors: errorsReducer,
    data: dataReducer
});

type RootState = ReturnType<typeof allReducers>;

function rootReducer(state: IOrderInitialization = defaultOrderInitialization, action: AnyAction): RootState {
    switch(action.type) {
        case AppActionsType.UPDATE_APP_DATA:
            return allReducers(action.payload.data, action);
        default:
            return allReducers(state, action);
    }
}

export default rootReducer;
