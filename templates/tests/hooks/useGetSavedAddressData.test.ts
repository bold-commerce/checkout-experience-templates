import {useCallApiAtOnEvents, useGetSavedAddressData, useGetSavedAddressOptions} from 'src/hooks';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {IAddress} from 'src/types';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useCallApiAtOnEvents')
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);

describe('Testing hook useGetSavedAddressData', () => {
    const debounceMock = jest.fn();
    const getTermValue = 'test-value';
    const target ={target: {value: ''}};
    const address = initialDataMock.application_state.addresses.shipping;
    const savedAddresses: Array<Partial<IAddress>> = [
        {id: '1', ...address},
        {id: '2', ...initialDataMock.application_state.addresses.billing}
    ]

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
            useCallApiAtOnEventsMock.mockReturnValueOnce(false);
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
        }
    );
        
    test('rendering the hook with api calls', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
    
        const {result} = renderHook(() => useGetSavedAddressData(Constants.SHIPPING));

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange({target: {value: savedAddresses[0].id}});
        expect(mockDispatch).toBeCalledTimes(3);
        result.current.handleChange({target: {value: savedAddresses[1].id}});
        expect(mockDispatch).toBeCalledTimes(6);
        result.current.handleChange({target: {value: 'new'}});
        expect(mockDispatch).toBeCalledTimes(8);
        expect(debounceMock).toBeCalledTimes(0);
    });

});
