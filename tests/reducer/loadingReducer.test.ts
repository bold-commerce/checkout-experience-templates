import {stateMock} from 'src/mocks';
import {loadingReducer} from 'src/reducer';
import {SET_EXTERNAL_PAYMENT_GATEWAY_LOADING, SET_LOADER, SET_PIGI_IFRAME_LOADER} from 'src/action';


describe('testing loadingReducer Reducer', () => {

    const defaultValues = stateMock.isLoading;

    test('should return the initial state ', () => {
        expect(loadingReducer(undefined, {type: ''})).toEqual(
            defaultValues
        );
    });

    test('testing SET_LOADER action ', () => {
        const state = loadingReducer(undefined ,
            {type: SET_LOADER,payload : {field: 'shippingLines', value: true}});

        expect(state.shippingLines).toEqual(true);
    });

    test('testing SET_PIGI_IFRAME_LOADER action ', () => {
        const state = loadingReducer(undefined ,
            {type: SET_PIGI_IFRAME_LOADER,payload : {pigiIframeLoader: true}});

        expect(state.pigiIframe).toEqual(true);
    });
});
