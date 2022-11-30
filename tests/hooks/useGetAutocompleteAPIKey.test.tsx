import {autocompleteServices, GoogleAutocompleteConstants, LoqateConstants} from 'src/constants';
import {useGetAutocompleteAPIKey} from 'src/hooks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useGetAPIKey', () => {
    test('Get Google API key', () => {
        expect(useGetAutocompleteAPIKey(autocompleteServices.GOOGLE_AUTOCOMPLETE)).toBe(GoogleAutocompleteConstants.API_KEY);
    });

    test('Get Loqate API key', () => {
        expect(useGetAutocompleteAPIKey(autocompleteServices.LOQATE)).toBe(LoqateConstants.API_KEY);
    });

    test('Get nonexistent API key', () => {
        expect(useGetAutocompleteAPIKey('none')).toBe('');
    });
});
