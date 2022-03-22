import {renderHook} from '@testing-library/react-hooks';
import {useGetPaymentSection} from 'src/hooks';
import * as useGetLoaderScreenVariable from 'src/hooks/useGetLoaderScreenVariable';
import * as useGetValidVariable from 'src/hooks/useGetValidVariable';
import * as getTerm from 'src/utils/getTerm';

describe('Testing hook useGetPaymentSection', () => {
    let useGetLoaderScreenVariableSpy: jest.SpyInstance;
    let useGetValidVariableSpy: jest.SpyInstance;
    let getTermSpy: jest.SpyInstance;
    const dataArray = [
        {
            name: 'Test isValidAddress false, isValidShippingLine false, and isLoading false',
            loadingParameter: false,
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading false',
            loadingParameter: false,
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false, and isLoading false',
            loadingParameter: false,
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading false',
            loadingParameter: false,
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine false,  and isLoading true',
            loadingParameter: true,
            validAddress: false,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine true, and isLoading true',
            loadingParameter: true,
            validAddress: true,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true, isValidShippingLine false,  and isLoading true',
            loadingParameter: true,
            validAddress: true,
            validShippingLine: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false, isValidShippingLine true, and isLoading true',
            loadingParameter: true,
            validAddress: false,
            validShippingLine: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useGetLoaderScreenVariableSpy = jest.spyOn(useGetLoaderScreenVariable, 'useGetLoaderScreenVariable');
        useGetValidVariableSpy = jest.spyOn(useGetValidVariable, 'useGetValidVariable');
        getTermSpy = jest.spyOn(getTerm, 'getTerm');
    });

    test.each(dataArray)( '$name', async ({
        loadingParameter,
        validAddress,
        validShippingLine,
        validTextParameter,
        fieldTextParameter,
        getLoaderCalled,
        getValidCalled,
        getTermCalled
    }) => {
        useGetValidVariableSpy.mockReturnValueOnce(validAddress);
        useGetValidVariableSpy.mockReturnValueOnce(validShippingLine);
        useGetLoaderScreenVariableSpy.mockReturnValueOnce(loadingParameter);
        getTermSpy.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter);

        const {result} = renderHook(() => useGetPaymentSection());
        const hookResult = result.current;

        expect(useGetLoaderScreenVariableSpy).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableSpy).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermSpy).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.loading).toBe(loadingParameter);
        expect(hookResult.isValidAddress).toBe(validAddress);
        expect(hookResult.isValidShippingLine).toBe(validShippingLine);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });
});
