import {useExpandableDiscount} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import { act } from 'react-dom/test-utils';

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/rootHooks');

const getTermMock = mocked(getTerm, true);

describe('Testing useExpandableDiscount', () => {
    const getTermValue = 'test-value';

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
    });

    test('test useExpandableDiscount hook properly', () => {
        const {result} = renderHook(() => useExpandableDiscount());

        expect(result.current.expandDiscount).toBe(false);
        expect(result.current.discountCodeInputText).toBe(getTermValue);
    });

    test('calling the toggle function', () => {
        const {result} = renderHook(() => useExpandableDiscount());

        expect(result.current.expandDiscount).toBe(false);
        act(() => {
            result.current.toggleDiscount();
        });
        expect(result.current.expandDiscount).toBe(true);
    });
});
