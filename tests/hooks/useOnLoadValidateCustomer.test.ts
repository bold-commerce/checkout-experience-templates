import {renderHook} from '@testing-library/react-hooks';
import {
    useGetLoaderScreenVariable,
    useGetValidVariable,
    useOnLoadValidateCustomer
} from 'src/hooks';
import {mocked} from 'jest-mock';
import {validateCustomerOnLoad} from 'src/library';
import {useDispatch} from 'react-redux';

jest.mock('react-redux');
jest.mock('src/library/validateCustomerOnLoad');
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetValidVariable');
const useDispatchMock = mocked(useDispatch, true);
const validateCustomerOnLoadMock = mocked(validateCustomerOnLoad, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

describe('Testing hook useOnLoadValidateCustomer', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('render hook', async () => {
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetValidVariableMock.mockReturnValue(false);

        renderHook(() => useOnLoadValidateCustomer());
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('shippingLines');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');

        expect(validateCustomerOnLoadMock).toHaveBeenCalledTimes(1);
    });

    test('render hook without validateCustomer', async () => {
        useGetLoaderScreenVariableMock.mockReturnValue(true);
        useGetValidVariableMock.mockReturnValue(true);

        renderHook(() => useOnLoadValidateCustomer());
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('shippingLines');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');

        expect(validateCustomerOnLoadMock).toHaveBeenCalledTimes(0);
    });
});
