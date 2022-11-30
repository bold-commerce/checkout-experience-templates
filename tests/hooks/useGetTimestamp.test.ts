import {renderHook} from '@testing-library/react-hooks';
import MockDate from 'mockdate';

import {useGetTimestamp} from 'src/hooks';

const mockDateInit = 1646855991347; // Timestamp represents this date: 2022-03-09 19:59:51.347 UTC time
const mockDateExpectedString = '2022-03-09 19:59:51.347';

describe('Testing hook useGetTimestamp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        MockDate.set(mockDateInit);
    });

    afterAll(() => {
        MockDate.reset();
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetTimestamp());

        expect(result.current).toStrictEqual(mockDateExpectedString);
    });
});
