import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedShippingLines} from 'src/hooks';
import {postShippingLines} from 'src/library';

jest.setTimeout(10000);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useDebouncedShippingLines', () => {
    const sleep = (delay: number) =>
        new Promise(resolve => setTimeout(resolve, delay));

    test('rendering the hook properly with timeout', async () => {
        const {result} = renderHook(() => useDebouncedShippingLines());
        expect(mockDispatch).toBeCalledTimes(0);

        act(result.current);
        await sleep(3000);
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toBeCalledWith(postShippingLines);
    });

});
