import {renderHook, act} from '@testing-library/react-hooks';
import {useDispatchAutocompleteData} from 'src/hooks';
import {IAutocompleteData} from 'src/types';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useDispatchAutocompleteData', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const autocompleteDataSet = [
        {numCalls: 7, autocompleteData: {address1: 'test'} as IAutocompleteData},
        {numCalls: 8, autocompleteData: {address1: 'test', address2: 'test2'} as IAutocompleteData},
        {numCalls: 8, autocompleteData: {address1: 'test', company: 'test2'} as IAutocompleteData},
        {numCalls: 9, autocompleteData: {address1: 'test', address2: 'test2', company: 'test3'} as IAutocompleteData},
    ];

    test.each(autocompleteDataSet)(
        'rendering the hook properly ($numCalls, $autocompleteData)',
        ({numCalls, autocompleteData}) => {
            const {result} = renderHook(() => useDispatchAutocompleteData());

            act(() => {
                result.current(autocompleteData);
            });

            expect(mockDispatch).toBeCalledTimes(numCalls);
        });

});
