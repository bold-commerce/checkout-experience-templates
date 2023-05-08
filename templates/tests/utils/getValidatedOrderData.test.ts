import {mocked} from 'jest-mock';
import {initialDataMock} from 'src/mocks';
import {getValidatedOrderData, validateApplicationStateData} from 'src/utils';
import {IInitializeOrderResponse} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/utils/validateApplicationStateData');
const validateApplicationStateDataMock = mocked(validateApplicationStateData, true);

describe('testing getValidatedOrderData', () => {

    test('getValidatedOrderData Success', () => {
        const mockOrderData: IInitializeOrderResponse = {...initialDataMock};
        validateApplicationStateDataMock.mockReturnValueOnce(mockOrderData.application_state);

        const result = getValidatedOrderData(mockOrderData);
        expect(validateApplicationStateDataMock).toHaveBeenCalledTimes(1);
        expect(validateApplicationStateDataMock).toHaveBeenCalledWith(mockOrderData.application_state);
        expect(result).toStrictEqual(mockOrderData);
    });
});
