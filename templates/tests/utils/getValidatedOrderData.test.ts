import {initialDataMock} from 'src/mocks';
import {IInitializeEndpointData} from 'src/types';
import {getValidatedOrderData} from 'src/utils';
import * as validateApplicationStateData from 'src/utils/validateApplicationStateData';

describe('testing getValidatedOrderData', () => {
    let validateApplicationStateDataSpy: jest.SpyInstance;
    const calledOnce = 1;

    test('getValidatedOrderData Success', () => {
        validateApplicationStateDataSpy = jest.spyOn(validateApplicationStateData, 'validateApplicationStateData');
        const mockOrderData: IInitializeEndpointData = {...initialDataMock};
        validateApplicationStateDataSpy.mockReturnValueOnce(mockOrderData.application_state);

        const result = getValidatedOrderData(mockOrderData);
        expect(validateApplicationStateDataSpy).toHaveBeenCalledTimes(calledOnce);
        expect(validateApplicationStateDataSpy).toHaveBeenCalledWith(mockOrderData.application_state);
        expect(result).toStrictEqual(mockOrderData);
    });
});
