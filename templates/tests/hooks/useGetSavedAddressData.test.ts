import {
    useCallApiAtOnEvents,
    useGetAddressData,
    useGetAppSettingData,
    useGetSavedAddressData,
    useGetSavedAddressOptions
} from 'src/hooks';
import {Constants} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {IAddress} from '@bold-commerce/checkout-frontend-library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetAppSettingData');
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);
const useGetAddressDataMock = mocked(useGetAddressData, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing hook useGetSavedAddressData', () => {
    const debounceMock = jest.fn();
    const getTermValue = 'test-value';
    const target ={target: {value: ''}};
    const address = initialDataMock.application_state.addresses.shipping;
    const savedAddresses: Array<Partial<IAddress>> = [
        {id: '1', ...address},
        {id: '2', ...initialDataMock.application_state.addresses.billing}
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetAppSettingDataMock.mockReturnValueOnce('same');
    });

    const hookData = [
        {type: Constants.SHIPPING, address: [], expected: []},
        {type: Constants.SHIPPING, address: [address as IAddress], expected: [{value: `${address.id}__${address.address_line_1 || 'incomplete'}`, name: address.address_line_1}]},
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
            expect(result.current.selectedOptionId).toStrictEqual(undefined);

            expect(mockDispatch).toBeCalledTimes(0);
            result.current.handleChange(target);
            expect(mockDispatch).toBeCalledTimes(1);
            expect(debounceMock).toBeCalledTimes(0);
        }
    );

    test('rendering the hook with api calls', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
        mockDispatch.mockReturnValue(Promise.resolve());

        const {result} = renderHook(() => useGetSavedAddressData(Constants.SHIPPING));

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange({target: {value: savedAddresses[0].id}});
        expect(mockDispatch).toBeCalledTimes(4);
        result.current.handleChange({target: {value: savedAddresses[1].id}});
        expect(mockDispatch).toBeCalledTimes(8);
        result.current.handleChange({target: {value: 'new'}});
        expect(mockDispatch).toBeCalledTimes(10);
        expect(debounceMock).toBeCalledTimes(0);
    });

    const selectedAddresIdData = [
        {
            name: 'Address equal to savedAddresses[0]',
            currentAddress: savedAddresses[0],
            expected: `${savedAddresses[0].id}__${savedAddresses[0].address_line_1 || 'incomplete'}`,
        },
        {
            name: 'Address equal to savedAddresses[0] with case differences',
            currentAddress: {
                ...savedAddresses[0],
                address_line_1: savedAddresses[0]?.address_line_1?.toUpperCase() + ' ',
            },
            expected: `${savedAddresses[0].id}__${savedAddresses[0].address_line_1 || 'incomplete'}`,
        },
        {
            name: 'Address not found in savedAddresses',
            currentAddress: {
                ...savedAddresses[0],
                address_line_1: 'not found',
            },
            expected: undefined,
        },
        {
            name: 'Address equal to savedAddresses[0] even when country name are different',
            currentAddress: {
                ...savedAddresses[0],
                country: 'Incorrect',
            },
            expected: `${savedAddresses[0].id}__${savedAddresses[0].address_line_1 || 'incomplete'}`,
        },
        {
            name: 'Address equal to savedAddresses[0] even when province name are different',
            currentAddress: {
                ...savedAddresses[0],
                province: 'Incorrect',
            },
            expected: `${savedAddresses[0].id}__${savedAddresses[0].address_line_1 || 'incomplete'}`,
        },
    ];

    test.each(selectedAddresIdData)(
        'selectedAddressId is properly set ($name)',
        ({ currentAddress, expected }) => {
            useCallApiAtOnEventsMock.mockReturnValueOnce(false);
            useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
            useGetAddressDataMock.mockReturnValueOnce(currentAddress as IAddress);

            const { result } = renderHook(() => useGetSavedAddressData(Constants.SHIPPING));

            expect(result.current.selectedOptionId).toStrictEqual(expected);
        }
    );

    test('ids are proper', () => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(false);
        useGetSavedAddressOptionsMock.mockReturnValueOnce([
            {
                ...savedAddresses[0],
                address_line_1: '',
            } as IAddress,
            savedAddresses[1] as IAddress,
        ]);

        const { result } = renderHook(() => useGetSavedAddressData(Constants.SHIPPING));

        expect(result.current.options).toEqual([
            {
                name: 'Incomplete address #1',
                value: 'null__incomplete',
            },
            {
                name: '100 Main Street',
                value: '2__100 Main Street',
            },
        ]);
    });
});
