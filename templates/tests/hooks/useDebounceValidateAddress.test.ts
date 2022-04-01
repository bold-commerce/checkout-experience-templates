import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedValidateAddress} from 'src/hooks';
import {Constants, debounceConstants} from 'src/constants';
import {validateBillingAddress, validateShippingAddress} from 'src/library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useDebounceValidateAddress', () => {

    afterEach(() => {
        (setTimeout as unknown as jest.SpyInstance).mockRestore?.();
        jest.resetAllMocks();
        jest.useRealTimers();
    });
    
    const dataSet = [
        {type: Constants.SHIPPING, expected: validateShippingAddress},
        {type: Constants.BILLING, expected: validateBillingAddress},
    ];
    
    test.each(dataSet)(
        'rendering the hook properly with timeout ($type, $expected)',
        async ({type, expected}) => {
            jest.useFakeTimers();
            jest.spyOn(global, 'setTimeout');

            const {result} = renderHook(() => useDebouncedValidateAddress(type));
            
            act(result.current);
            expect(mockDispatch).toBeCalledTimes(0);
            jest.runAllTimers();

            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledWith(expected);
            expect(setTimeout).toBeCalledWith(expect.any(Function), debounceConstants.DEFAULT_DEBOUNCE_TIME);
        });

});
