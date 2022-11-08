import {getTerm} from 'src/utils';
import {postDiscounts, validateEmailAddress} from 'src/library';
import {
    useGetLoaderScreenVariable,
    useGetDiscounts,
    useGetErrorByField,
    useGetAppSettingData,
    useGetCustomerInfoDataByField,
    useGetIsLoading
} from 'src/hooks';
import {useSummaryDiscountCode} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {stateMock} from 'src/mocks/stateMock';
import {act} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {actionRemoveErrorByField, actionRemoveErrorByType, actionSetLoaderAndDisableButton, actionUpdateDiscountCodeText} from 'src/action';
import React from 'react';

const mockDispatch = jest.fn();
const mockSetFocus = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetDiscounts');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetIsLoading');
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
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

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
        getTermMock.mockReturnValue(data.getTerm);
        useGetAppSettingDataMock.mockReturnValue(data.discountText);
        useGetErrorByFieldMock.mockReturnValue(data.errorByField);
        useGetLoaderScreenVariableMock.mockReturnValue(data.loaderVariable);
        useGetDiscountsMock.mockReturnValue(discounts);
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonReturn);
        postDiscountsMock.mockReturnValue(postDiscountThunkMock);
        useGetIsLoadingMock.mockReturnValue(false);
        useGetCustomerInfoDataByFieldMock.mockReturnValue('');
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

    test('testing the add discount event with customer email address And postDiscount returning HTMLElement',  async () => {
        useGetDiscountsMock.mockReturnValueOnce([]);
        const discountPill = createPill();
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('abc@gmail.com');
        mockDispatch
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve(discountPill));

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        await hookResult.addDiscount(event);

        expect(useGetCustomerInfoDataByFieldMock).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockSetFocus).toHaveBeenCalledTimes(1);
        expect(event.preventDefault).not.toBeCalled();
        expect(actionSetLoaderAndDisableButtonMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);
    });

    test('testing the add discount event with customer email address And postDiscount returning null',  async () => {
        useGetDiscountsMock.mockReturnValueOnce([]);
        useGetCustomerInfoDataByFieldMock.mockReturnValueOnce('abc@gmail.com');
        mockDispatch
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve(null));

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        await hookResult.addDiscount(event);

        expect(useGetCustomerInfoDataByFieldMock).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockSetFocus).toHaveBeenCalledTimes(0);
        expect(event.preventDefault).not.toBeCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(actionSetLoaderAndDisableButtonMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);
    });

    test('testing the add discount event without customer email address And postDiscount returning HTMLElement',  async () => {
        useGetDiscountsMock.mockReturnValueOnce([]);
        const discountPill = createPill();
        mockDispatch
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve(discountPill));

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        await hookResult.addDiscount(event);

        expect(event.preventDefault).not.toBeCalled();
        expect(mockSetFocus).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(actionSetLoaderAndDisableButtonMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButtonReturn);
        expect(mockDispatch).not.toHaveBeenCalledWith(validateEmailAddressMock);
        expect(mockDispatch).toHaveBeenCalledWith(postDiscountThunkMock);
    });

    test('testing the add discount event without customer email address And postDiscount returning null',  async () => {
        mockDispatch
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve(null));

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        await hookResult.addDiscount(event);

        expect(mockSetFocus).toHaveBeenCalledTimes(0);
        expect(event.preventDefault).not.toBeCalled();
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

    test('testing click is prevented when button is disabled',  async () => {
        useGetAppSettingDataMock.mockReturnValue('');
        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;
        await hookResult.addDiscount(event);

        expect(event.preventDefault).toBeCalled();
    });

    test('testing useEffect is changing aria-label and aria-live when success with discounts populated',  async () => {
        getTermMock
            .mockReturnValueOnce(data.getTerm)
            .mockReturnValueOnce('apply_discount_code_button')
            .mockReturnValueOnce('discount_code_successfully_applied');
        useGetDiscountsMock.mockReturnValueOnce(discounts);
        const discountPill = createPill();
        mockDispatch
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.resolve(discountPill));

        jest.useFakeTimers();

        const {result} = renderHook(() => useSummaryDiscountCode());
        const hookResult = result.current;
        const event = {
            currentTarget: document.createElement('button'),
            preventDefault: jest.fn(),
        } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

        expect(hookResult.ariaLabel).toBe('discount_code_successfully_applied');
        expect(hookResult.ariaLive).toBe('assertive');

        await act(async () => {
            await hookResult.addDiscount(event);
            jest.runAllTimers();
        });

        expect(result.current.ariaLabel).toBe('apply_discount_code_button');
        expect(result.current.ariaLive).toBe('polite');

        jest.useRealTimers();
    });
});

function createPill(): HTMLElement {
    const discountPill = document.createElement('button');
    discountPill.className = '.discount-code__delete-discount-code';
    discountPill.focus = mockSetFocus;
    return discountPill;
}

function createInputText(): HTMLElement {
    const discountInputTextField = document.createElement('input');
    discountInputTextField.type = 'text';
    discountInputTextField.value = 'some discount code';
    discountInputTextField.focus = mockSetFocus;
    return discountInputTextField;


}
