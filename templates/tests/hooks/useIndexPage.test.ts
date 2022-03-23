import { addressMock, stateMock } from 'src/mocks';
import { mocked } from 'ts-jest/utils';
import { getTerm } from 'src/utils';
import { useGetLineItems, useGetOrderTotal, useGetShippingData, useLogin, useIndexPage, useGetErrors } from 'src/hooks';
import { renderHook } from '@testing-library/react-hooks';
import { displayOrderProcessingScreen, processOrder } from 'src/library';
import { useDispatch } from 'react-redux';
import * as sendRefreshOrderAction from '@bold-commerce/checkout-frontend-library/lib/pigi/sendRefreshOrderAction';
import * as sendAddPaymentAction from '@bold-commerce/checkout-frontend-library/lib/pigi/sendAddPaymentAction';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useLogin');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/hooks/useGetOrderTotal');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useGetErrors');
jest.mock('src/library');
const useDispatchMock = mocked(useDispatch, true);
const getTermMock = mocked(getTerm, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const useLoginMock = mocked(useLogin, true);
const useGetOrderTotalMock = mocked(useGetOrderTotal, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetErrorsMock = mocked(useGetErrors, true);
const processOrderMock = mocked(processOrder, true);

describe('testing hook useIndexPage', () => {
    window.shopName = 'Test Shop';
    const getTermValue = 'test term';
    const emailValue = 'test@email.com';
    const useLoginValue = {
        email: emailValue,
        loginUrl: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: false,
        acceptMarketingHidden: true
    }

    const dispatchMock = jest.fn();
    const processOrderThunkMock = jest.fn();

    const sendRefreshOrderActionAsyncSpy = jest.spyOn(sendRefreshOrderAction, 'sendRefreshOrderActionAsync');
    const sendAddPaymentActionAsyncSpy = jest.spyOn(sendAddPaymentAction, 'sendAddPaymentActionAsync');
    
    const errorMock = {
        address_type: 'billing',
        sub_type: 'test_sub_type',
        type: 'test_type',
        severity: 'test_severity',
        field: 'test_field',
        message: 'Test error message!'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetLineItemsMock.mockReturnValue(stateMock.data.application_state.line_items);
        useLoginMock.mockReturnValue(useLoginValue);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useDispatchMock.mockReturnValue(dispatchMock);
        processOrderMock.mockReturnValue(processOrderThunkMock);
    })

    test('test the hook properly with no errors in array', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([]);
        
        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;
        expect(hookResult.loginText).toBe(getTermValue);
        expect(hookResult.orderTotal).toBe(9999);
        expect(hookResult.websiteName).toBe(window.shopName);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.summaryHeadingText).toBe(getTermValue)
        expect(hookResult.email).toBe(emailValue);
        expect(hookResult.shippingHeadingText).toBe(getTermValue);
        expect(hookResult.address).toBe(addressMock);
        expect(hookResult.paymentHeadingText).toBe(getTermValue);

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncSpy).toHaveBeenCalledTimes(1);
        expect(sendAddPaymentActionAsyncSpy).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });


    test('test the hook properly with errors in array', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([errorMock]);
        
        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).not.toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncSpy).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncSpy).toHaveBeenCalledTimes(0);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });


    test('test the hook properly with zero order total', async () => {
        useGetOrderTotalMock.mockReturnValue(0);
        useGetErrorsMock.mockReturnValue([]);
        
        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(sendRefreshOrderActionAsyncSpy).toHaveBeenCalledTimes(0);
        expect(sendAddPaymentActionAsyncSpy).toHaveBeenCalledTimes(0);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
    });
});
