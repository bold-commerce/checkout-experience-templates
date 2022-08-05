import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {getOrderInitialization, getValidatedOrderData} from 'src/utils';

jest.mock('src/utils/getValidatedOrderData');
jest.mock('src/utils/validateApplicationStateData');
const getValidatedOrderDataMock = mocked(getValidatedOrderData, true);

describe('testing getOrderInitialization', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        getValidatedOrderDataMock.mockReturnValue(stateMock.data);
    });

    test('return initialized state with parameter', () => {
        const returnExpectation = {
            ...stateMock,
            errors: []
        };
        const result = getOrderInitialization(stateMock.data);

        expect(getValidatedOrderDataMock).toBeCalledTimes(1);
        expect(result).toStrictEqual(returnExpectation);
    });
});
