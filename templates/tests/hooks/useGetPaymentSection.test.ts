import {renderHook} from '@testing-library/react-hooks';
import {useGetPaymentSection} from 'src/hooks';
import * as useGetLoaderScreenVariable from 'src/hooks/useGetLoaderScreenVariable';
import * as useGetValidVariable from 'src/hooks/useGetValidVariable';
import * as getTerm from 'src/utils/getTerm';

describe('Testing hook useGetPaymentSection', () => {
    let useGetLoaderScreenVariableSpy: jest.SpyInstance;
    let useGetValidVariableSpy: jest.SpyInstance;
    let getTermSpy: jest.SpyInstance;
    const one = 1;
    const two = 2;
    const dataArray = [
        {
            name: 'Test isValidAddress and isLoading false',
            loadingParameter: false,
            validParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: one,
            getValidCalled: one,
            getTermCalled: two
        },
        {
            name: 'Test isValidAddress true and isLoading false',
            loadingParameter: false,
            validParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: one,
            getValidCalled: one,
            getTermCalled: two
        },
        {
            name: 'Test isValidAddress false and isLoading true',
            loadingParameter: true,
            validParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: one,
            getValidCalled: one,
            getTermCalled: two
        },
        {
            name: 'Test isValidAddress and isLoading true',
            loadingParameter: true,
            validParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            getLoaderCalled: one,
            getValidCalled: one,
            getTermCalled: two
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useGetLoaderScreenVariableSpy = jest.spyOn(useGetLoaderScreenVariable, 'useGetLoaderScreenVariable');
        useGetValidVariableSpy = jest.spyOn(useGetValidVariable, 'useGetValidVariable');
        getTermSpy = jest.spyOn(getTerm, 'getTerm');
    });

    test.each(dataArray)( '$name', async ({
        loadingParameter,
        validParameter,
        validTextParameter,
        fieldTextParameter,
        getLoaderCalled,
        getValidCalled,
        getTermCalled
    }) => {
        useGetValidVariableSpy.mockReturnValueOnce(validParameter);
        useGetLoaderScreenVariableSpy.mockReturnValueOnce(loadingParameter);
        getTermSpy.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter);

        const {result} = renderHook(() => useGetPaymentSection());
        const hookResult = result.current;

        expect(useGetLoaderScreenVariableSpy).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableSpy).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermSpy).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.loading).toBe(loadingParameter);
        expect(hookResult.isValidAddress).toBe(validParameter);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });
});
