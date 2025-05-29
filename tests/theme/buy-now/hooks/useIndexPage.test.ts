import {addressMock, stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {useGetLineItems, useGetOrderTotal, useGetShippingData, useLogin, useGetErrors, useGetValidVariable, useGetAppSettingData, useGetCustomerInfoDataByField} from 'src/hooks';
import {useIndexPage} from 'src/themes/buy-now/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {displayOrderProcessingScreen, processOrder, updateLineItemQuantity, validateBillingAddress} from 'src/library';
import {useDispatch} from 'react-redux';
import {Constants} from 'src/constants';
import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useLogin');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/hooks/useGetOrderTotal');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useGetErrors');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/library/displayOrderProcessingScreen');
jest.mock('src/library/processOrder');
jest.mock('src/library/updateLineItemQuantity');
jest.mock('src/library/validateBillingAddress');
const useDispatchMock = mocked(useDispatch, true);
const getTermMock = mocked(getTerm, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const useLoginMock = mocked(useLogin, true);
const useGetOrderTotalMock = mocked(useGetOrderTotal, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const useGetErrorsMock = mocked(useGetErrors, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const processOrderMock = mocked(processOrder, true);
const updateLineItemQuantityMock = mocked(updateLineItemQuantity, true);
const useGetCustomerInfoDataByFieldMock = mocked(useGetCustomerInfoDataByField, true);
const validateBillingAddressMock = mocked(validateBillingAddress, true);

describe('testing hook useIndexPage', () => {
    const getTermValue = 'test term';
    const emailValue = 'test@email.com';
    const useLoginValue = {
        email: emailValue,
        loginUrl: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: false,
        acceptMarketingHidden: true
    };

    const dispatchMock = jest.fn();
    const processOrderThunkMock = jest.fn();
    const validateBillingAddressThunkMock = jest.fn();

    const errorMock = {
        address_type: 'billing',
        sub_type: 'test_sub_type',
        type: 'test_type',
        severity: 'test_severity',
        field: 'test_field',
        message: 'Test error message!'
    };

    const convertedFetchError: IApiErrorResponse = {
        message: '',
        type: 'api',
        field: '',
        severity: 'critical',
        sub_type: ''
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetLineItemsMock.mockReturnValue(stateMock.data.application_state.line_items);
        useLoginMock.mockReturnValue(useLoginValue);
        useGetShippingDataMock.mockReturnValue(addressMock);
        useDispatchMock.mockReturnValue(dispatchMock);
        processOrderMock.mockReturnValue(processOrderThunkMock);
        useGetAppSettingDataMock.mockReturnValue(Constants.SHIPPING_SAME);
        useGetCustomerInfoDataByFieldMock.mockReturnValue(emailValue);
        validateBillingAddressMock.mockReturnValue(validateBillingAddressThunkMock);
    });

    test('test the hook properly with no errors in array', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([]);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;
        expect(hookResult.loginText).toBe(getTermValue);
        expect(hookResult.orderTotal).toBe(9999);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.summaryHeadingText).toBe(getTermValue);
        expect(hookResult.email).toBe(emailValue);
        expect(hookResult.shippingHeadingText).toBe(getTermValue);
        expect(hookResult.address).toBe(addressMock);
        expect(hookResult.paymentHeadingText).toBe(getTermValue);

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('test the hook with different billing address', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([]);
        useGetValidVariableMock.mockReturnValue(true);
        useGetAppSettingDataMock.mockReturnValue(Constants.SHIPPING_DIFFERENT);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;
        expect(hookResult.loginText).toBe(getTermValue);
        expect(hookResult.orderTotal).toBe(9999);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.summaryHeadingText).toBe(getTermValue);
        expect(hookResult.email).toBe(emailValue);
        expect(hookResult.shippingHeadingText).toBe(getTermValue);
        expect(hookResult.address).toBe(addressMock);
        expect(hookResult.paymentHeadingText).toBe(getTermValue);

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('test the hook with different billing address', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([]);
        useGetValidVariableMock.mockReturnValue(true);
        useGetAppSettingDataMock.mockReturnValue(Constants.SHIPPING_DIFFERENT);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;
        expect(hookResult.loginText).toBe(getTermValue);
        expect(hookResult.orderTotal).toBe(9999);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.summaryHeadingText).toBe(getTermValue);
        expect(hookResult.email).toBe(emailValue);
        expect(hookResult.shippingHeadingText).toBe(getTermValue);
        expect(hookResult.address).toBe(addressMock);
        expect(hookResult.paymentHeadingText).toBe(getTermValue);

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('test the hook with invalid billing address', async () => {
        useGetValidVariableMock.mockReturnValue(false);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).not.toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });

    test('test the hook properly with errors in array', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([errorMock]);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).not.toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });


    test('test the hook properly with zero order total', async () => {
        useGetOrderTotalMock.mockReturnValue(0);
        useGetErrorsMock.mockReturnValue([]);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(1);
    });

    test('calling updateLineItemQuantity should call proper function with correct arguments', async () => {
        const lineItemKey = 'test_line_item_key';
        const quantity = 5;

        const {result} = renderHook(useIndexPage);
        const {updateLineItemQuantity} = result.current;
        await updateLineItemQuantity(lineItemKey, quantity);

        expect(dispatchMock).toBeCalledTimes(1);
        expect(updateLineItemQuantityMock).toBeCalledWith(lineItemKey, quantity);
    });

    test('calling onClickCheckout with promise rejected', async () => {
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetErrorsMock.mockReturnValue([]);
        useGetValidVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;

        await hookResult.checkoutOnClick();
        expect(dispatchMock).toHaveBeenCalledWith(displayOrderProcessingScreen);
        expect(processOrderMock).toHaveBeenCalledTimes(0);
    });
});
