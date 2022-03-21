import {renderHook} from '@testing-library/react-hooks';
import {
    useGetLoaderScreenVariable,
    useGetValidVariable,
    useOnLoadValidateCustomer
} from 'src/hooks';
import {mocked} from 'ts-jest/utils';
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
    let addEventListenerSpy: jest.SpyInstance;
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        useDispatchMock.mockReturnValue(dispatchMock);
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetValidVariableMock.mockReturnValue(false);
    });

    test('render hook', async () => {
        renderHook(() => useOnLoadValidateCustomer());
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('shippingLines');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');
        expect(addEventListenerSpy).toHaveBeenCalledTimes(5);

        expect(validateCustomerOnLoadMock).toHaveBeenCalledTimes(0);
        global.dispatchEvent(new Event('load'));
        expect(validateCustomerOnLoadMock).toHaveBeenCalledTimes(1);
    });
});
