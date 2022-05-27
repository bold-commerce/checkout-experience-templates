import {getTerm} from 'src/utils';
import {postDiscounts, validateEmailAddress} from 'src/library';
import {
    useGetLoaderScreenVariable,
    useGetDiscounts,
    useGetErrorByField,
    useGetAppSettingData,
    useGetCustomerInfoDataByField
} from 'src/hooks';
import {useSummaryDiscountCode} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {stateMock} from 'src/mocks/stateMock';
import {act} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {actionRemoveErrorByField, actionRemoveErrorByType, actionSetLoaderAndDisableButton, actionUpdateDiscountCodeText} from 'src/action';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetDiscounts');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/utils');
jest.mock('src/action');
jest.mock('src/library');

const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetDiscountsMock = mocked(useGetDiscounts, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const getTermMock = mocked(getTerm, true);
const actionRemoveErrorByFieldMock = mocked(actionRemoveErrorByField, true);
const actionRemoveErrorByTypeMock = mocked(actionRemoveErrorByType, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const actionUpdateDiscountCodeTextMock = mocked(actionUpdateDiscountCodeText, true);
const postDiscountsMock = mocked(postDiscounts, true);
const validateEmailAddressMock = mocked(validateEmailAddress, true);
const useGetCustomerInfoDataByFieldMock = mocked(useGetCustomerInfoDataByField, true);

describe('Testing hook useSummaryDiscountCode', () => {

    const postDiscountThunkMock = jest.fn();
    const actionSetLoaderAndDisableButtonReturn = jest.fn();

    const discounts = stateMock.data.application_state.discounts;
    const data = {
        discounts: discounts,
        discountText: 'TEST',
        errorByField: '',
        loaderVariable: false,
        getTerm: 'test-value'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockImplementation(() => Promise.resolve());
        getTermMock.mockReturnValueOnce(data.getTerm);
        useGetAppSettingDataMock.mockReturnValueOnce(data.discountText);
        useGetErrorByFieldMock.mockReturnValueOnce(data.errorByField);
        useGetLoaderScreenVariableMock.mockReturnValueOnce(data.loaderVariable);
        useGetDiscountsMock.mockReturnValueOnce(discounts);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonReturn);
        postDiscountsMock.mockReturnValue(postDiscountThunkMock);
    });

    test('rendering the hook properly', () => {
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('abc@gmail.com');
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        expect(hookResult.discounts).toBe(data.discounts);
        expect(hookResult.discountError).toBe(data.errorByField);
        expect(hookResult.buttonLoading).toBe(data.loaderVariable);
        expect(hookResult.discountCodeText).toBe(data.discountText);
        expect(hookResult.discountCodeInputText).toBe(data.getTerm);
    });

    test('testing the add discount event with customer email address',  async () => {
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('abc@gmail.com');
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;

        await hookResult.addDiscount();

        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(actionSetLoaderAndDisableButtonMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);

    });

    test('testing the add discount event without customer email address',  async () => {
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('');
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;

        await hookResult.addDiscount();

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(actionSetLoaderAndDisableButtonMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).not.toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);

    });

    test('testing the update discount event', () => {
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('abc@gmail.com');
        const event = {target: {value: 'test-value'}};
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        act(() => {
            hookResult.updateNewDiscountCode(event);
        });

        expect(actionRemoveErrorByTypeMock).toBeCalled();
        expect(actionRemoveErrorByFieldMock).toBeCalled();
        expect(actionUpdateDiscountCodeTextMock).toBeCalled();
    });


});
