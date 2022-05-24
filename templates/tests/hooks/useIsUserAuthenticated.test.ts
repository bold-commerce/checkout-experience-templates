import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useIsUserAuthenticated} from 'src/hooks';
import {mocked} from 'jest-mock';

jest.mock('src/hooks/rootHooks');
const useAppSelectorMock = mocked(useAppSelector, true);

describe('Testing hook useIsUserAuthenticated', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const hookData = [
        { id: '0-abc-1', expected: true},
        { id: '1', expected: true},
        { id: '0', expected: false},
        { id: null, expected: false},
    ];

    test.each(hookData)(
        'rendering the hook properly ($id, $expected)',
        ({id, expected}) => {

            useAppSelectorMock.mockReturnValueOnce(id);
            const {result} = renderHook(() => useIsUserAuthenticated());
            expect(result.current).toBe(expected);
            expect(useAppSelector).toHaveBeenCalledTimes(1);
        });
});
