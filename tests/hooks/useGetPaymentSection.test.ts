import {renderHook} from '@testing-library/react-hooks';
import {useGetPaymentSection, useGetValidVariable} from 'src/hooks';
import {getTerm} from 'src/utils';
import {mocked} from 'jest-mock';
jest.setTimeout(10000);
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/utils/getTerm');
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetPaymentSection', () => {
    const dataArray = [
        {
            name: 'Test isValidAddress false, isValidShippingLine false, and isLoading false',
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading false',
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false, and isLoading false',
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading false',
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine false,  and isLoading true',
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading true',
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false,  and isLoading true',
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading true',
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            pigiErrorTextParameter: 'testText3',
            getValidCalled: 2,
            getTermCalled: 2
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(dataArray)( '$name', async ({
        validAddress,
        validShippingLine,
        validTextParameter,
        fieldTextParameter,
        pigiErrorTextParameter,
        getValidCalled,
        getTermCalled
    }) => {
        useGetValidVariableMock.mockReturnValueOnce(validAddress);
        useGetValidVariableMock.mockReturnValueOnce(validShippingLine);
        getTermMock.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter).mockReturnValueOnce(pigiErrorTextParameter);

        const {result} = renderHook(() => useGetPaymentSection());
        const hookResult = result.current;

        expect(useGetValidVariableMock).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermMock).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.isValidAddress).toBe(validAddress);
        expect(hookResult.isValidShippingLine).toBe(validShippingLine);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });
});

