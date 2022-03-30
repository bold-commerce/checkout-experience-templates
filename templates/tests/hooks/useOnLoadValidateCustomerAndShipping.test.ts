import {renderHook} from '@testing-library/react-hooks';
import {useGetValidVariable, useOnLoadValidateCustomerAndShipping} from 'src/hooks';
import {mocked} from 'ts-jest/utils';
import {validateCustomerAndShippingOnLoad} from 'src/library';
import {useDispatch} from 'react-redux';

jest.mock('react-redux');
jest.mock('src/library/validateCustomerAndShippingOnLoad');
jest.mock('src/hooks/useGetValidVariable');
const useDispatchMock = mocked(useDispatch, true);
const validateCustomerAndShippingOnLoadMock = mocked(validateCustomerAndShippingOnLoad, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

describe('Testing hook useOnLoadValidateCustomerAndShipping', () => {
    let addEventListenerSpy: jest.SpyInstance;
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        useDispatchMock.mockReturnValue(dispatchMock);
    });

    test('render hook', async () => {
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetValidVariableMock.mockReturnValueOnce(false);

        renderHook(() => useOnLoadValidateCustomerAndShipping());
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingAddress');
        expect(useGetValidVariableMock).toHaveBeenCalledWith('shippingLine');
        expect(addEventListenerSpy).toHaveBeenCalledTimes(5);

        expect(validateCustomerAndShippingOnLoadMock).toHaveBeenCalledTimes(0);
        global.dispatchEvent(new Event('load'));
        expect(validateCustomerAndShippingOnLoadMock).toHaveBeenCalledTimes(1);
    });
});
