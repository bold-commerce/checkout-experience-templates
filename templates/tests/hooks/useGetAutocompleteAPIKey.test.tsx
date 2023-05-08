import {useGetAutocompleteAPIKey} from 'src/hooks';

const store = {
    data: {
        initial_data: {
            general_settings: {
                address_autocomplete: {
                    api_key: '123456789',
                },
            },
        },
    }
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: jest.fn().mockImplementation(func => func(store)),
}));

describe('Testing hook useGetAPIKey', () => {
    test('Get API Key', () => {
        expect(useGetAutocompleteAPIKey()).toBe('123456789');
    });
});
