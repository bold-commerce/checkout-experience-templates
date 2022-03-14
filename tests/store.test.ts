import { stateMock } from 'src/mocks';
import * as Store from 'src/store';

describe('testing store', () => {

    test('should return store with populated state', () => {
        const storeReturnExpectation = {
            ...stateMock,
            errors: [],
        };

        // TODO: Need to handle initializeSession promise rejection
        const store = Store.initializeStore(stateMock.data);
        const result = store.getState();

        expect(result).toStrictEqual(storeReturnExpectation);
    });

    test('should return store with default state', () => {
        const storeReturnExpectation = {
            ...stateMock,
            errors: [],
        };

        const store = Store.initializeStore();
        const result = store.getState();

        expect(result).toStrictEqual(storeReturnExpectation);
    });
});
