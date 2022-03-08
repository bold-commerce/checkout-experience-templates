import {useGetSavedAddressData, useGetSavedAddressOptions} from 'src/hooks';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'ts-jest/utils';
import {getTerm} from 'src/utils';
import {IAddress} from 'src/types';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetAddressData');
const getTermMock = mocked(getTerm, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);

describe('Testing hook useGetSavedAddressData', () => {
    const debounceMock = jest.fn();
    const getTermValue = 'test-value';
    const target ={target: {value: ''}};
    const address = initialDataMock.application_state.addresses.shipping;

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
    });

    const hookData = [
        {type: Constants.SHIPPING, address: [], expected: []},
        {type: Constants.SHIPPING, address: [address as IAddress], expected: [{value: address.address_line_1, name: address.address_line_1}]},
    ];

    test.each(hookData)(
        'rendering the hook properly ($type, $address)',
        ({type, address, expected}) => {
            useGetSavedAddressOptionsMock.mockReturnValueOnce(address);

            const {result} = renderHook(() => useGetSavedAddressData(type));
            expect(result.current.label).toStrictEqual(getTermValue);
            expect(result.current.placeholder).toStrictEqual(getTermValue);
            expect(result.current.id).toStrictEqual(type+'-saved-address-select');
            expect(result.current.options).toStrictEqual(expected);

            expect(mockDispatch).toBeCalledTimes(0);
            result.current.handleChange(target);
            expect(mockDispatch).toBeCalledTimes(1);
            expect(debounceMock).toBeCalledTimes(0);
        });
});
