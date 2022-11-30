import {stateMock} from 'src/mocks';
import {initializeStore} from 'src/store';
import {mocked} from 'jest-mock';
import {initializeSession} from 'src/library';

jest.mock('src/library');
const initializeSessionMock = mocked(initializeSession, true);

describe('testing store', () => {
    const storeReturnExpectation = {
        ...stateMock,
        errors: [],
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('should return store with populated state', () => {
        const store = initializeStore(stateMock.data);
        const result = store.getState();

        expect(result).toStrictEqual(storeReturnExpectation);
        expect(initializeSessionMock).toHaveBeenCalledTimes(1);
    });

    test('should return store with default state', () => {
        const store = initializeStore();
        const result = store.getState();

        expect(result).toStrictEqual(storeReturnExpectation);
        expect(initializeSessionMock).toHaveBeenCalledTimes(0);
    });
});
