import {act} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {actionUpdateBillingTypeInSettings, actionUpdateBillingType, actionRemoveErrorByAddressType, actionSetAppStateValid} from 'src/action';
import {Constants} from 'src/constants';
import {useBillingAddress, useCallApiAtOnEvents, useIsUserAuthenticated, useGetAppSettingData, useGetShippingData} from 'src/hooks';
import {validateBillingAddress} from 'src/library';
import {addressMock} from 'src/mocks';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/action');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useIsUserAuthenticated');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/utils');
const actionUpdateBillingTypeInSettingsMock = mocked(actionUpdateBillingTypeInSettings, true);
const actionUpdateBillingTypeMock = mocked(actionUpdateBillingType, true);
const actionRemoveErrorByAddressTypeMock = mocked(actionRemoveErrorByAddressType, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useIsUserAuthenticatedMock = mocked(useIsUserAuthenticated, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const useGetShippingDataMock = mocked(useGetShippingData, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useBillingAddress', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering the hook properly', () => {
        const getTermValue = 'test-value';
        const isLogin = true;
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedMock.mockReturnValueOnce(isLogin);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        getTermMock.mockReturnValue(getTermValue);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;

        expect(hookResult.customBilling).toBe(Constants.SHIPPING_SAME);
        expect(hookResult.billingSame).toBe(getTermValue);
        expect(hookResult.billingDifferent).toBe(getTermValue);
        expect(hookResult.billingTitle).toBe(getTermValue);
    });

    test('verifying the address props', () => {
        const getTermValue = 'test-value';
        const isLogin = true;
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedMock.mockReturnValueOnce(isLogin);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        getTermMock.mockReturnValue(getTermValue);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current.addressProps;

        expect(hookResult.title).toBe(getTermValue);
        expect(hookResult.type).toBe(Constants.BILLING);
        expect(hookResult.showTitle).toBe(false);
        expect(hookResult.showSavedAddresses).toBe(isLogin);
    });

    test('testing the handle change event', () => {
        const getTermValue = 'test-value';
        const event = {target: {value: 'test-value'}};
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        getTermMock.mockReturnValue(getTermValue);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(actionUpdateBillingTypeInSettingsMock).toBeCalled();
        expect(actionUpdateBillingTypeMock).toBeCalled();
        expect(actionRemoveErrorByAddressTypeMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
    });

    test('testing the toggle same as shipping event - handleChange', () => {
        const getTermValue = 'test-value';
        const event = {target: {value: Constants.SHIPPING_SAME}};
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        getTermMock.mockReturnValue(getTermValue);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(actionUpdateBillingTypeInSettingsMock).toBeCalled();
        expect(actionUpdateBillingTypeMock).toBeCalled();
        expect(actionRemoveErrorByAddressTypeMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledTimes(4);
        expect(mockDispatch).toHaveBeenCalledWith(validateBillingAddress);
    });

    test('testing the toggle same as shipping event - toggleBillingSameAsShipping', () => {
        const getTermValue = 'test-value';
        const event = {target: {value: 'test-value'}};
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_DIFFERENT);
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        getTermMock.mockReturnValue(getTermValue);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;

        act(() => {
            hookResult.toggleBillingSameAsShipping(event);
        });

        expect(actionUpdateBillingTypeInSettingsMock).toBeCalled();
        expect(actionUpdateBillingTypeMock).toBeCalled();
        expect(actionSetAppStateValidMock).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(validateBillingAddress);
    });

    test('testing the toggle different from shipping event', () => {
        const getTermValue = 'test-value';
        const event = {target: {value: 'test-value'}};
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        useGetShippingDataMock.mockReturnValueOnce(addressMock);
        getTermMock.mockReturnValue(getTermValue);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;

        act(() => {
            hookResult.toggleBillingSameAsShipping(event);
        });

        expect(actionUpdateBillingTypeInSettingsMock).toBeCalled();
        expect(actionUpdateBillingTypeMock).toBeCalled();
        expect(actionSetAppStateValidMock).toBeCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(validateBillingAddress);
    });

});
