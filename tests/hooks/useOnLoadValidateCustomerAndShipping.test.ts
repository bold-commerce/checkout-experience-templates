import {renderHook} from '@testing-library/react-hooks';
import {useGetValidVariable, useOnLoadValidateCustomerAndShipping} from 'src/hooks';
import {mocked} from 'jest-mock';
import {validateCustomerAndShippingOnLoad} from 'src/library';
import {useDispatch} from 'react-redux';

jest.mock('react-redux');
jest.mock('src/library/validateCustomerAndShippingOnLoad');
jest.mock('src/hooks/useGetValidVariable');
const useDispatchMock = mocked(useDispatch, true);
const validateCustomerAndShippingOnLoadMock = mocked(validateCustomerAndShippingOnLoad, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

describe('Testing hook useOnLoadValidateCustomerAndShipping', () => {
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('render hook', async () => {
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetValidVariableMock.mockReturnValueOnce(false);

        const result = renderHook(() => useOnLoadValidateCustomerAndShipping());
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingLine');

        expect(validateCustomerAndShippingOnLoadMock).toHaveBeenCalledTimes(1);
    });

    test('render hook without validatingCustomerAndShipping', async () => {
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetValidVariableMock.mockReturnValueOnce(true);

        renderHook(() => useOnLoadValidateCustomerAndShipping());
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingLine');

        expect(validateCustomerAndShippingOnLoadMock).toHaveBeenCalledTimes(0);
    });
});
