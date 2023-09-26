import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebounceLifeField} from 'src/hooks';
import {patchLifeField} from 'src/library';
import {debounceConstants} from 'src/constants';
import {mocked} from 'jest-mock';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';

const mockDispatch = jest.fn();
jest.mock('src/library/patchLifeField');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const patchLifeFieldMock = mocked(patchLifeField, true);

describe('Testing hook useDebounceLifeField', () => {

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    test('rendering the hook properly with timeout', async () => {

        const lifeField = {['test']: 'test_value'} as ICartParameters;
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const {result} = renderHook(() => useDebounceLifeField(lifeField));

        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();

        await mockDispatch;
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(patchLifeFieldMock(lifeField));
        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

});
