import * as AppActionsType from '../action/appActionType';
import {AnyAction, combineReducers} from 'redux';
import {IInitialState} from 'src/types';
import {
    availableShippingLinesReducer,
    billingReducer,
    countryReducer,
    customerReducer,
    discountsReducer,
    errorsReducer,
    jwtTokenReducer,
    languageReducer,
    lineItemsReducer,
    loadingReducer,
    orderMetaReducer,
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
    resumableLinkReducer
} from 'src/reducer';
import {autocompleteServices, Constants} from 'src/constants';

export const initialState: IInitialState = {
    screenWidth: window.innerWidth,
    languageIso: 'en',
    autocompleteService: autocompleteServices.GOOGLE_AUTOCOMPLETE,
    callApiAtOnEvents: false,
    billingType: Constants.SHIPPING_SAME,
    discountText: '',
    pigiDisplaySca: false
};

export function reducer(state = initialState, action: AnyAction): IInitialState {
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
        case AppActionsType.SET_PIGI_DISPLAY_SCA:
            return {...state, pigiDisplaySca: action.payload.pigiDisplaySca};
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

const appStateReducer = combineReducers({
    customer: customerReducer,
    addresses: addressReducer,
    line_items: lineItemsReducer,
    shipping: shippingOptionsReducer,
    taxes: taxesReducer,
    order_total:orderTotalReducer,
    discounts: discountsReducer,
    payments: paymentsReducer,
    order_meta_data: orderMetaReducer,
    resumable_link: resumableLinkReducer,
    created_via: createdViaReducer
});

const generalSettingReducer = combineReducers({
    checkout_process: checkoutProcessReducer,
    address_autocomplete: addressAutoCompleteReducer
});

const initialDataReducer = combineReducers({
    shop_name: shopNameReducer,
    country_info: countryReducer,
    supported_languages: languageReducer,
    general_settings: generalSettingReducer
});

const dataReducer = combineReducers({
    jwt_token: jwtTokenReducer,
    public_order_id: publicOrderIdReducer,
    application_state: appStateReducer,
    initial_data: initialDataReducer
});

const rootReducer = combineReducers({
    appSetting: reducer,
    isLoading: loadingReducer,
    isButtonDisable: buttonDisableReducer,
    isValid: validReducer,
    overlay: overlayReducer,
    errors: errorsReducer,
    data: dataReducer
});

export default rootReducer;
