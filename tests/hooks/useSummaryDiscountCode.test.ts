import * as getTerm from 'src/utils/getTerm';
import * as useGetAppSettingData from 'src/hooks/useGetAppSettingData';
import * as useGetDiscounts from 'src/hooks/useGetDiscounts';
import * as useGetErrorByField from 'src/hooks/useGetErrorByField';
import * as appAction from 'src/action/appAction';
import * as postDiscounts from 'src/library/postDiscounts';
import * as useGetLoaderScreenVariable from 'src/hooks/useGetLoaderScreenVariable';
import {useSummaryDiscountCode} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {stateMock} from 'src/mocks/stateMock';
import {act} from '@testing-library/react';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useSummaryDiscountCode', () => {
    let getTermSpy: jest.SpyInstance;
    let useGetDiscountsSpy: jest.SpyInstance;
    let useGetAppSettingDataSpy: jest.SpyInstance;
    let useGetErrorByFieldSpy: jest.SpyInstance;
    let useGetLoaderScreenVariableSpy: jest.SpyInstance;
    let actionSetLoaderAndDisableButtonSpy: jest.SpyInstance;
    let postDiscountsSpy: jest.SpyInstance;
    let actionRemoveErrorByFieldSpy: jest.SpyInstance;
    let actionUpdateDiscountCodeTextSpy: jest.SpyInstance;

    const data = {
        discounts: stateMock.data.application_state.discounts,
        discountText: 'TEST',
        errorByField: '',
        loaderVariable: false,
        getTerm: 'test-value'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useGetDiscountsSpy = jest.spyOn(useGetDiscounts , 'useGetDiscounts').mockReturnValueOnce(data.discounts);
        getTermSpy = jest.spyOn(getTerm, 'getTerm').mockReturnValueOnce(data.getTerm);
        useGetAppSettingDataSpy = jest.spyOn(useGetAppSettingData, 'useGetAppSettingData').mockReturnValueOnce(data.discountText);
        useGetErrorByFieldSpy = jest.spyOn(useGetErrorByField, 'useGetErrorByField').mockReturnValueOnce(data.errorByField);
        useGetLoaderScreenVariableSpy = jest.spyOn(useGetLoaderScreenVariable, 'useGetLoaderScreenVariable').mockReturnValueOnce(data.loaderVariable);
        actionSetLoaderAndDisableButtonSpy = jest.spyOn(appAction , 'actionSetLoaderAndDisableButton');
        postDiscountsSpy = jest.spyOn(postDiscounts , 'postDiscounts');
        actionRemoveErrorByFieldSpy = jest.spyOn(appAction , 'actionRemoveErrorByField');
        actionUpdateDiscountCodeTextSpy = jest.spyOn(appAction , 'actionUpdateDiscountCodeText');
    });

    test('rendering the hook properly', () => {

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        expect(hookResult.discounts).toBe(data.discounts);
        expect(hookResult.discountError).toBe(data.errorByField);
        expect(hookResult.buttonLoading).toBe(data.loaderVariable);
        expect(hookResult.discountCodeText).toBe(data.discountText);
        expect(hookResult.discountCodeInputText).toBe(data.getTerm);
    });

    test('testing the add discount event', () => {
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        act(() => {
            hookResult.addDiscount();
        });

        expect(actionSetLoaderAndDisableButtonSpy).toBeCalled();
        expect(postDiscountsSpy).toBeCalled();
    });

    test('testing the update discount event', () => {
        const event = {target: {value: 'test-value'}};
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        act(() => {
            hookResult.updateNewDiscountCode(event);
        });

        expect(actionRemoveErrorByFieldSpy).toBeCalled();
        expect(actionUpdateDiscountCodeTextSpy).toBeCalled();
    });


});
