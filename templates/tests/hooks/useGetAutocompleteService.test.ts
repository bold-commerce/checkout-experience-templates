import {renderHook} from '@testing-library/react-hooks';
import {autocompleteServices} from 'src/constants';
import {
    useGetAutocompleteService,
    useInitiateGenericAutocomplete,
    useInitiateGoogleAutocomplete,
    useInitiateLoqate
} from 'src/hooks';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/useGetAutocompleteService');
jest.mock('src/hooks/useInitiateGoogleAutocomplete');
jest.mock('src/hooks/useInitiateLoqate');
const useGetAutocompleteServiceMock = mocked(useGetAutocompleteService, true);
const useInitiateGoogleAutocompleteMock = mocked(useInitiateGoogleAutocomplete, true);
const useInitiateLoqateMock = mocked(useInitiateLoqate, true);

describe('Testing hook useInitiateGenericAutocomplete', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const hookData = [
        { service: '', googleCalls: 0, loqateCalls: 0},
        { service: autocompleteServices.GOOGLE_AUTOCOMPLETE, googleCalls: 1, loqateCalls: 0},
        { service: autocompleteServices.LOQATE, googleCalls: 0, loqateCalls: 1},
    ];

    test.each(hookData)('autocomplete using service: $service, Google calls: $googleCalls, Loqate Calls: $loqateCalls)',
        ({service, googleCalls, loqateCalls}) => {
            useGetAutocompleteServiceMock.mockReturnValueOnce(service);
            renderHook(() => useInitiateGenericAutocomplete());
            expect(useInitiateGoogleAutocompleteMock).toHaveBeenCalledTimes(googleCalls);
            expect(useInitiateLoqateMock).toHaveBeenCalledTimes(loqateCalls);
        });
});
