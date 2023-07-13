import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebounceLifeField} from 'src/hooks';
import {patchOrderMetaData} from 'src/library';
import {debounceConstants} from 'src/constants';
import {IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';

const mockDispatch = jest.fn();
jest.mock('src/library/patchOrderMetaData');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);

describe('Testing hook useDebounceLifeField', () => {

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });

    const payload: IPatchOrderMetaDataRequest = {
        cart_parameters: null,
        note_attributes: null,
        notes: null,
        tags: null,
    };

    test('rendering the hook properly with timeout', async () => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');

        const {result} = renderHook(() => useDebounceLifeField(payload));

        act(result.current);
        expect(mockDispatch).toBeCalledTimes(0);
        jest.runAllTimers();

        await mockDispatch;
        expect(mockDispatch).toBeCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(patchOrderMetaDataMock(payload));
        expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
    });

});
