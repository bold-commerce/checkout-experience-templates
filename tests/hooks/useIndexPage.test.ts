import { addressMock, stateMock } from 'src/mocks';
import { mocked } from 'ts-jest/utils';
import { getTerm } from 'src/utils';
import { useGetLineItems, useGetOrderTotal, useGetShippingData, useLogin, useIndexPage } from 'src/hooks';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useLogin');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/hooks/useGetOrderTotal');
jest.mock('src/hooks/useGetAddressData');
const getTermMock = mocked(getTerm, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const useLoginMock = mocked(useLogin, true);
const useGetOrderTotalMock = mocked(useGetOrderTotal, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);

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

    test('test the hook properly', () => {
        getTermMock.mockReturnValue(getTermValue);
        useGetLineItemsMock.mockReturnValue(stateMock.data.application_state.line_items);
        useLoginMock.mockReturnValue(useLoginValue);
        useGetOrderTotalMock.mockReturnValue(9999);
        useGetShippingDataMock.mockReturnValue(addressMock);
        
        const {result} = renderHook(() => useIndexPage());
        const hookResult = result.current;
        hookResult.checkoutOnClick();
        expect(hookResult.checkoutOnClick).toBeDefined();
        expect(hookResult.loginText).toBe(getTermValue);
        expect(hookResult.orderTotal).toBe(9999);
        expect(hookResult.websiteName).toBe(window.shopName);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.summaryHeadingText).toBe(getTermValue)
        expect(hookResult.email).toBe(emailValue);
        expect(hookResult.shippingHeadingText).toBe(getTermValue);
        expect(hookResult.address).toBe(addressMock);
        expect(hookResult.paymentHeadingText).toBe(getTermValue);
    });
});
