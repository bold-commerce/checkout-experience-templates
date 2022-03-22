import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {useDebouncedValidateAddress} from 'src/hooks';
import {Constants} from 'src/constants';
import {validateBillingAddress, validateShippingAddress} from 'src/library';

jest.setTimeout(10000);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useDebounceValidateAddress', () => {
    const sleep = (delay: number) =>
        new Promise(resolve => setTimeout(resolve, delay));

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const dataSet = [
        {type: Constants.SHIPPING, expected: validateShippingAddress},
        {type: Constants.BILLING, expected: validateBillingAddress},
    ];

    test.each(dataSet)(
        'rendering the hook properly with timeout ($type, $expected)',
        async ({type, expected}) => {
            const {result} = renderHook(() => useDebouncedValidateAddress(type));
            expect(mockDispatch).toBeCalledTimes(0);

            act(result.current);
            await sleep(3000);
            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledWith(expected);
        });

});
