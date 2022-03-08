import {renderHook} from '@testing-library/react-hooks';
import {useGetShippingLines} from 'src/hooks';
import * as useGetLoaderScreenVariable from 'src/hooks/useGetLoaderScreenVariable';
import * as useGetValidVariable from 'src/hooks/useGetValidVariable';
import * as getTerm from 'src/utils/getTerm';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useGetShippingLines', () => {
    let useGetLoaderScreenVariableSpy: jest.SpyInstance;
    let useGetValidVariableSpy: jest.SpyInstance;
    let getTermSpy: jest.SpyInstance;
    const dataArray = [
        {
            name: 'Test isValidAddress and isLoading false',
            loadingParameter: false,
            validParameter: false,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 0,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress true and isLoading false',
            loadingParameter: false,
            validParameter: true,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 0,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false and isLoading true',
            loadingParameter: true,
            validParameter: false,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 0,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress and isLoading true',
            loadingParameter: true,
            validParameter: true,
            updatedParameter: false,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 0,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress false and updatedAddress true',
            loadingParameter: true,
            validParameter: false,
            updatedParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 0,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
        },
        {
            name: 'Test isValidAddress updatedAddress true',
            loadingParameter: true,
            validParameter: true,
            updatedParameter: true,
            validTextParameter: 'testText1',
            fieldTextParameter: 'testText2',
            dispatchCalled: 2,
            getLoaderCalled: 1,
            getValidCalled: 2,
            getTermCalled: 2
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
        updatedParameter,
        validTextParameter,
        fieldTextParameter,
        dispatchCalled,
        getLoaderCalled,
        getValidCalled,
        getTermCalled
    }) => {
        useGetValidVariableSpy.mockReturnValueOnce(validParameter).mockReturnValueOnce(updatedParameter);
        useGetLoaderScreenVariableSpy.mockReturnValueOnce(loadingParameter);
        getTermSpy.mockReturnValueOnce(validTextParameter).mockReturnValueOnce(fieldTextParameter);

        const {result} = renderHook(() => useGetShippingLines());
        const hookResult = result.current;

        expect(mockDispatch).toHaveBeenCalledTimes(dispatchCalled);
        expect(useGetLoaderScreenVariableSpy).toHaveBeenCalledTimes(getLoaderCalled);
        expect(useGetValidVariableSpy).toHaveBeenCalledTimes(getValidCalled);
        expect(getTermSpy).toHaveBeenCalledTimes(getTermCalled);
        expect(hookResult.loading).toBe(loadingParameter);
        expect(hookResult.isValidAddress).toBe(validParameter);
        expect(hookResult.notValidText).toBe(validTextParameter);
        expect(hookResult.fieldSectionText).toBe(fieldTextParameter);
    });
});
