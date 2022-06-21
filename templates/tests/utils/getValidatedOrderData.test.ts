import {initialDataMock} from 'src/mocks';
import {getValidatedOrderData} from 'src/utils';
import * as validateApplicationStateData from 'src/utils/validateApplicationStateData';
import {IInitializeOrderResponse} from '@bold-commerce/checkout-frontend-library';

describe('testing getValidatedOrderData', () => {
    let validateApplicationStateDataSpy: jest.SpyInstance;

    test('getValidatedOrderData Success', () => {
        validateApplicationStateDataSpy = jest.spyOn(validateApplicationStateData, 'validateApplicationStateData');
        const mockOrderData: IInitializeOrderResponse = {...initialDataMock};
        validateApplicationStateDataSpy.mockReturnValueOnce(mockOrderData.application_state);

        const result = getValidatedOrderData(mockOrderData);
        expect(validateApplicationStateDataSpy).toHaveBeenCalledTimes(1);
        expect(validateApplicationStateDataSpy).toHaveBeenCalledWith(mockOrderData.application_state);
        expect(result).toStrictEqual(mockOrderData);
    });
});
