import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {
    useGetShippingLines,
    useGetLoaderScreenVariable,
    useGetValidVariable,
    useGetRequiresShipping,
} from 'src/hooks';
import {getTerm} from 'src/utils';

jest.mock('react-redux');
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/hooks/useGetRequiresShipping');
jest.mock('src/utils');
const useDispatchMock = mocked(useDispatch, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetRequiresShippingMock = mocked(useGetRequiresShipping, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetShippingLines', () => {
    const mockDispatch = jest.fn();
    const dataArray = [
        {
            name: 'Test isValidAddress and isLoading false',
            requiresShipping: true,
            loadingParameter: false,
            validParameter: false,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test isValidAddress true and isLoading false',
            requiresShipping: true,
            loadingParameter: false,
            validParameter: true,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test isValidAddress false and isLoading true',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: false,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test isValidAddress and isLoading true',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: true,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test isValidAddress false and updatedAddress true',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: false,
            updatedParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 1,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test isValidAddress updatedAddress true',
            requiresShipping: true,
            loadingParameter: true,
            validParameter: true,
            updatedParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 3,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        },
        {
            name: 'Test not requires shipping',
            requiresShipping: false,
            loadingParameter: true,
            validParameter: true,
            updatedParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 5,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 3,
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(mockDispatch);
        mockDispatch.mockReturnValue(Promise.resolve());
    });

    test.each(dataArray)( '$name', async ({
        requiresShipping,
        loadingParameter,
        validParameter,
        updatedParameter,
        validTextParameter,
        fieldTextParameter,
        dispatchCalled,
        getLoaderCalled,
        getValidCalled,
        getTermCalled,
    }) => {
        useGetValidVariableMock.mockReturnValueOnce(validParameter).mockReturnValueOnce(updatedParameter);
        useGetLoaderScreenVariableMock.mockReturnValueOnce(loadingParameter);
        useGetRequiresShippingMock.mockReturnValue(requiresShipping);
        getTermMock.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter);

        const {result} = renderHook(() => useGetShippingLines());
        const hookResult = result.current;
        await Promise.resolve();

        expect(mockDispatch).toHaveBeenCalledTimes(dispatchCalled);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableMock).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermMock).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.loading).toBe(loadingParameter);
        expect(hookResult.isValidAddress).toBe(validParameter);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });
});
