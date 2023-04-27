import {stateMock} from 'src/mocks';
import {externalPaymentGatewayInitialDataReducer, loadingReducer, paymentMethodReducer} from 'src/reducer';
import {
    SET_EXTERNAL_PAYMENT_GATEWAY_LOADING,
    SET_EXTERNAL_PAYMENT_GATEWAY_VALID,
    UPDATE_PAYMENT_METHOD
} from 'src/action';
import {externalPaymentGatewaysReducer} from 'src/reducer/externalPaymentGatewaysReducer';


describe('testing externalPaymentGatewayReducer', () => {
    const defaultValues = stateMock.data.initial_data.external_payment_gateways;
    const dataSet = [
        {name: 'should return the initial state', expectedValue: defaultValues},
    ];

    test.each(dataSet)('$name', ({name, expectedValue}) => {
        const state = externalPaymentGatewayInitialDataReducer(defaultValues);
        expect(state).toEqual(expectedValue);
    });

    test('testing SET_EXTERNAL_GATEWAY_LOADING true action', () => {
        const state = externalPaymentGatewaysReducer(undefined,
            {type: SET_EXTERNAL_PAYMENT_GATEWAY_LOADING, payload: {gateway: {public_id: 'p'}, value: true}});
        expect([...state.isLoading.values()]).toEqual(['p']);
    });

    test('testing SET_EXTERNAL_GATEWAY_LOADING false action', () => {
        const state = externalPaymentGatewaysReducer(undefined,
            {type: SET_EXTERNAL_PAYMENT_GATEWAY_LOADING, payload: {gateway: {public_id: 'p'}, value: false}});
        expect([...state.isLoading.values()]).toEqual([]);
    });

    test('testing SET_EXTERNAL_GATEWAY_VALID true action', () => {
        const state = externalPaymentGatewaysReducer(undefined,
            {type: SET_EXTERNAL_PAYMENT_GATEWAY_VALID, payload: {gateway: {public_id: 'p'}, value: true}});
        expect([...state.isValid.values()]).toEqual(['p']);
    });

    test('testing SET_EXTERNAL_GATEWAY_VALID false action', () => {
        const state = externalPaymentGatewaysReducer(undefined,
            {type: SET_EXTERNAL_PAYMENT_GATEWAY_VALID, payload: {gateway: {public_id: 'p'}, value: false}});
        expect([...state.isValid.values()]).toEqual([]);
    });
});
