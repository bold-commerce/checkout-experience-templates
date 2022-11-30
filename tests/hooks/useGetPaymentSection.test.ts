import {renderHook} from '@testing-library/react-hooks';
import {useGetPaymentSection, useGetLoaderScreenVariable, useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';
import {mocked} from 'jest-mock';
import {act} from '@testing-library/react';
import {checkLoadPigiErrors} from 'src/library';
jest.setTimeout(10000);
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/utils/getTerm');
jest.mock('src/library/checkLoadPigiErrors');
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const getTermMock = mocked(getTerm, true);
const checkLoadPigiErrorsMock = mocked(checkLoadPigiErrors, true);

describe('Testing hook useGetPaymentSection', () => {
    const sleep = (delay: number) =>
        new Promise(resolve => setTimeout(resolve, delay));
    const dataArray = [
        {
            name: 'Test isValidAddress false, isValidShippingLine false, and isLoading false',
            loadingParameter: false,
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading false',
            loadingParameter: false,
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false, and isLoading false',
            loadingParameter: false,
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading false',
            loadingParameter: false,
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine false,  and isLoading true',
            loadingParameter: true,
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading true',
            loadingParameter: true,
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false,  and isLoading true',
            loadingParameter: true,
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading true',
            loadingParameter: true,
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getLoaderCalled: 1,
            getValidCalled: 3,
            getTermCalled: 3
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        checkLoadPigiErrorsMock.mockImplementation((func: () => void) => {
            act(() => func());
            return () => Promise.resolve();
        });
    });

    test.each(dataArray)( '$name', async ({
        loadingParameter,
        validAddress,
        validShippingLine,
        validTextParameter,
        fieldTextParameter,
        pigiErrorTextParameter,
        getLoaderCalled,
        getValidCalled,
        getTermCalled
    }) => {
        useGetValidVariableMock.mockReturnValueOnce(validAddress);
        useGetValidVariableMock.mockReturnValueOnce(validShippingLine);
        useGetLoaderScreenVariableMock.mockReturnValueOnce(loadingParameter);
        getTermMock.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter).mockReturnValueOnce(pigiErrorTextParameter);

        const {result} = renderHook(() => useGetPaymentSection());
        const hookResult = result.current;

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableMock).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermMock).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.loading).toBe(loadingParameter);
        expect(hookResult.isValidAddress).toBe(validAddress);
        expect(hookResult.isValidShippingLine).toBe(validShippingLine);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });

    test('validating the onLoad function', async () => {
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetValidVariableMock.mockReturnValueOnce(true);
        useGetLoaderScreenVariableMock.mockReturnValueOnce(false);
        getTermMock.mockReturnValueOnce('Text1').mockReturnValueOnce('Text2').mockReturnValueOnce('Text3');

        const {result} = renderHook(() => useGetPaymentSection());
        expect(mockDispatch).toHaveBeenCalledTimes(2);
        act(result.current.onLoad);
        await sleep(1000);
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(checkLoadPigiErrorsMock).toHaveBeenCalledTimes(1);
    });
});

