import {renderHook} from '@testing-library/react-hooks';
import * as getTerm from 'src/utils/getTerm';
import * as useIsUserAuthenticated from 'src/hooks/useIsUserAuthenticated';
import * as useGetAppSettingData from 'src/hooks/useGetAppSettingData';
import * as useGetShippingData from 'src/hooks/useGetAddressData';
import {Constants} from 'src/constants';
import {useBillingAddress, useCallApiAtOnEvents} from 'src/hooks';
import {act} from '@testing-library/react';
import * as customerAction from 'src/action/customerAction';
import * as appAction from 'src/action/appAction';
import { addressMock } from 'src/mocks';
import { mocked } from 'ts-jest/utils';
import { validateBillingAddress } from 'src/library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useCallApiAtOnEvents');
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);

describe('Testing hook useBillingAddress', () => {
    let useGetAppSettingDataSpy: jest.SpyInstance;
    let useIsUserAuthenticatedSpy: jest.SpyInstance;
    let useGetShippingDataSpy: jest.SpyInstance;
    let getTermSpy: jest.SpyInstance;
    let actionUpdateBillingTypeInSettingsSpy: jest.SpyInstance;
    let actionRemoveErrorByAddressTypeSpy: jest.SpyInstance;
    let actionUpdateBillingTypeSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.resetAllMocks();
        getTermSpy = jest.spyOn(getTerm, 'getTerm');
        useGetAppSettingDataSpy = jest.spyOn(useGetAppSettingData, 'useGetAppSettingData');
        useIsUserAuthenticatedSpy = jest.spyOn(useIsUserAuthenticated, 'useIsUserAuthenticated');
        useGetShippingDataSpy = jest.spyOn(useGetShippingData, 'useGetShippingData');
        actionUpdateBillingTypeInSettingsSpy = jest.spyOn(appAction, 'actionUpdateBillingTypeInSettings');
        actionUpdateBillingTypeSpy = jest.spyOn(customerAction, 'actionUpdateBillingType');
        actionRemoveErrorByAddressTypeSpy = jest.spyOn(appAction, 'actionRemoveErrorByAddressType');

    });

    test('rendering the hook properly', () => {
        const getTermValue = 'test-value';
        const isLogin = true;
        useGetAppSettingDataSpy.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedSpy.mockReturnValueOnce(isLogin);
        useGetShippingDataSpy.mockReturnValueOnce(addressMock);
        getTermSpy.mockReturnValue(getTermValue);
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
        useGetAppSettingDataSpy.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedSpy.mockReturnValueOnce(isLogin);
        useGetShippingDataSpy.mockReturnValueOnce(addressMock);
        getTermSpy.mockReturnValue(getTermValue);
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
        useGetAppSettingDataSpy.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedSpy.mockReturnValueOnce(true);
        useGetShippingDataSpy.mockReturnValueOnce(addressMock);
        getTermSpy.mockReturnValue(getTermValue);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(actionUpdateBillingTypeInSettingsSpy).toBeCalled();
        expect(actionUpdateBillingTypeSpy).toBeCalled();
        expect(actionRemoveErrorByAddressTypeSpy).toBeCalled();
    });

    test('testing the toggle same as shipping event', () => { 
        const getTermValue = 'test-value';
        const event = {target: {value: 'test-value'}};
        useGetAppSettingDataSpy.mockReturnValueOnce(Constants.SHIPPING_DIFFERENT);
        useIsUserAuthenticatedSpy.mockReturnValueOnce(true);
        useGetShippingDataSpy.mockReturnValueOnce(addressMock);
        getTermSpy.mockReturnValue(getTermValue);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;

        act(() => {
            hookResult.toggleBillingSameAsShipping(event);
        });

        expect(actionUpdateBillingTypeInSettingsSpy).toBeCalled();
        expect(actionUpdateBillingTypeSpy).toBeCalled();
        expect(mockDispatch).toHaveBeenCalledWith(validateBillingAddress);
    });

    test('testing the toggle different from shipping event', () => { 
        const getTermValue = 'test-value';
        const event = {target: {value: 'test-value'}};
        useGetAppSettingDataSpy.mockReturnValueOnce(Constants.SHIPPING_SAME);
        useIsUserAuthenticatedSpy.mockReturnValueOnce(true);
        useGetShippingDataSpy.mockReturnValueOnce(addressMock);
        getTermSpy.mockReturnValue(getTermValue);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        const {result} = renderHook(() => useBillingAddress());
        const hookResult = result.current;

        act(() => {
            hookResult.toggleBillingSameAsShipping(event);
        });

        expect(actionUpdateBillingTypeInSettingsSpy).toBeCalled();
        expect(actionUpdateBillingTypeSpy).toBeCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(validateBillingAddress);
    });

});
