import {stateMock} from 'src/mocks';
import {jwtTokenReducer, publicOrderIdReducer} from 'src/reducer';

describe('testing jwtTokenReducer Reducer', () => {

    const defaultValues = stateMock.data.jwt_token;
    test('should return the initial state ', () => {
        expect(jwtTokenReducer(undefined)).toEqual(
            defaultValues
        );
    });

});

describe('testing publicOrderIdReducer Reducer', () => {

    const defaultValues = stateMock.data.public_order_id;
    test('should return the initial state ', () => {
        expect(publicOrderIdReducer(undefined)).toEqual(
            defaultValues
        );
    });

});
