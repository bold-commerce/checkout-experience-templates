import { stateMock } from 'src/mocks';
import { getOrderInitialization } from 'src/utils/getOrderInitialization';
import * as getValidatedOrderData from 'src/utils/getValidatedOrderData';
import * as validateApplicationStateData from 'src/utils/validateApplicationStateData';

describe('testing getOrderInitialization', () => {
    let getValidatedOrderDataSpy: jest.SpyInstance;
    let validateApplicationStateDataSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.resetAllMocks();

        getValidatedOrderDataSpy = jest.spyOn(getValidatedOrderData, 'getValidatedOrderData');
        validateApplicationStateDataSpy = jest.spyOn(validateApplicationStateData, 'validateApplicationStateData');
    });

    test('return initialized state with parameter', () => {
        const returnExpectation = {
            ...stateMock,
            errors: []
        };
        const result = getOrderInitialization(stateMock.data);

        expect(getValidatedOrderDataSpy).toBeCalledTimes(1);
        expect(validateApplicationStateDataSpy).toBeCalledTimes(1);
        expect(result).toStrictEqual(returnExpectation);
    });
});
