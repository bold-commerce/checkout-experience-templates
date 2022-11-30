import {stateMock} from 'src/mocks';
import {
    SET_CALL_API_ON_EVENTS,
    SET_LANGUAGE_ISO,
    SET_PIGI_DISPLAY_SCA,
    UPDATE_BILLING_TYPE,
    UPDATE_DISCOUNT_CODE_TEXT,
    UPDATE_SCREEN_WIDTH,
    UPDATE_APP_DATA, SET_EXPRESS_PAYMENT_SECTION_ENABLED,
} from 'src/action';
import {Constants} from 'src/constants';
import rootReducer, {reducer} from 'src/reducer/rootReducer';

describe('testing appSettings reducer', () => {

    const defaultState = stateMock.appSetting;
    const dataSet = [
        {name: 'testing initial state', action: '', payload: '', expected: defaultState},
        {name: 'testing SET_LANGUAGE_ISO action', state: defaultState, action: SET_LANGUAGE_ISO, payload: {languageIso: 'fr'}, expected: {...defaultState, languageIso: 'fr'}},
        {name: 'testing SET_CALL_API_ON_EVENTS action', action: SET_CALL_API_ON_EVENTS, payload: {callApiAtOnEvents: true}, expected: {...defaultState, callApiAtOnEvents: true}},
        {name: 'testing UPDATE_SCREEN_WIDTH action', action: UPDATE_SCREEN_WIDTH, payload: 200, expected: {...defaultState, screenWidth: 200}},
        {name: 'testing UPDATE_BILLING_TYPE action',  action: UPDATE_BILLING_TYPE, payload: {type: Constants.SHIPPING_DIFFERENT }, expected: {...defaultState, billingType: Constants.SHIPPING_DIFFERENT }},
        {name: 'testing UPDATE_DISCOUNT_CODE_TEXT action', action: UPDATE_DISCOUNT_CODE_TEXT, payload: {code: 'test'}, expected: {...defaultState, discountText: 'test'}},
        {name: 'testing SET_PIGI_DISPLAY_SCA action', action: SET_PIGI_DISPLAY_SCA, payload: {pigiDisplaySca: true}, expected: {...defaultState, pigiDisplaySca: true}},
        {name: 'testing SET_EXPRESS_PAYMENT_SECTION_ENABLED action', action: SET_EXPRESS_PAYMENT_SECTION_ENABLED, payload: {isExpressPaySectionEnable: true}, expected: {...defaultState, isExpressPaySectionEnable: true}},
    ];

    test.each(dataSet)('$name', ({name, action, payload, expected}) => {
        const newState = reducer(defaultState,
            {type: action, payload: payload});

        expect(newState).toEqual(expected);

    });

});

describe('testing rootReducer', () => {
    const newState = rootReducer(undefined, {type: UPDATE_APP_DATA, payload: {data: stateMock}});

    expect(newState).toEqual(stateMock);
});
