import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebounceCustomer, useGetCustomerInfoData} from 'src/hooks';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {updateCustomer, postGuestCustomer} from 'src/library';
import {debounceConstants} from 'src/constants';

jest.setTimeout(10000);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/library');
jest.mock('src/hooks/useGetCustomerInformation');
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const updateCustomerMock = mocked(updateCustomer, true);
const postGuestCustomerMock = mocked(postGuestCustomer, true);

describe('Testing hook useDebounceGuestCustomer', () => {
    const customer = stateMock.data.application_state.customer;

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    const dataSet = [
        {platformId: '1234', expected: updateCustomerMock},
        {platformId: null, expected: postGuestCustomerMock},
    ];

    test.each(dataSet)(
        'rendering the hook properly with timeout ($platformId, $expected)',
        async ({platformId, expected}) => {
            jest.useFakeTimers();
            jest.spyOn(global, 'setTimeout');

            const localCustomer = {...customer, platform_id: platformId};
            useGetCustomerInfoDataMock.mockReturnValueOnce(localCustomer);

            const {result} = renderHook(() => useDebounceCustomer());

            act(result.current);
            expect(mockDispatch).toBeCalledTimes(0);
            jest.runAllTimers();

            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledWith(expected);
            expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
        });

});
