import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedValidateAddress, useGetAppSettingData} from 'src/hooks';
import {Constants, debounceConstants} from 'src/constants';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import {mocked} from 'jest-mock';
import { useDispatch } from 'react-redux';

jest.mock('react-redux');
const useDispatchMock = mocked(useDispatch, true);

jest.mock('src/hooks/useGetAppSettingData');
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing hook useDebounceValidateAddress', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
        useDispatchMock.mockReturnValue(mockDispatch);
        mockDispatch.mockReturnValue(Promise.resolve());
    });


    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
    });
    
    test('rendering the hook properly to validate shipping address with billing different from shipping', async () => {
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_DIFFERENT);

        const {result} = renderHook(() => useDebouncedValidateAddress(Constants.SHIPPING));
        
        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();
        await Promise.resolve();

        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith(validateShippingAddress);

        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

    test('rendering the hook properly to validate shipping address with billing same as shipping', async () => {
        useGetAppSettingDataMock.mockReturnValueOnce(Constants.SHIPPING_SAME);

        const {result} = renderHook(() => useDebouncedValidateAddress(Constants.SHIPPING));
        
        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();
        await Promise.resolve();

        expect(mockDispatch).toBeCalledTimes(2);
        expect(mockDispatch).toBeCalledWith(validateShippingAddress);
        expect(mockDispatch).toBeCalledWith(validateBillingAddress);

        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });


    test('rendering the hook properly to validate billing address', async () => {
        const {result} = renderHook(() => useDebouncedValidateAddress(Constants.BILLING));
        
        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();
        await Promise.resolve();

        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith(validateBillingAddress);

        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

});
