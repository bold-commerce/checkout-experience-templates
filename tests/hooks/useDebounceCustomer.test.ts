import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebounceCustomer, useGetCustomerInfoData} from 'src/hooks';
import {mocked} from 'ts-jest/utils';
import {stateMock} from 'src/mocks';
import {updateCustomer, postGuestCustomer} from 'src/library';

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
    const sleep = (delay: number) =>
        new Promise(resolve => setTimeout(resolve, delay));

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('rendering the hook properly with timeout - logged in User', async () => {
        const localCustomer = {...customer, platform_id: '1234'};
        useGetCustomerInfoDataMock.mockReturnValueOnce(localCustomer);
        const {result} = renderHook(() => useDebounceCustomer());
        expect(mockDispatch).toBeCalledTimes(0);

        act(result.current);
        await sleep(3000);
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith(updateCustomerMock);
    });

    test('rendering the hook properly with timeout - Guest User', async () => {
        const localCustomer = {...customer, platform_id: null};
        useGetCustomerInfoDataMock.mockReturnValueOnce(localCustomer);
        const {result} = renderHook(() => useDebounceCustomer());
        expect(mockDispatch).toBeCalledTimes(0);

        act(result.current);
        await sleep(3000);
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith(postGuestCustomerMock);
    });

});
