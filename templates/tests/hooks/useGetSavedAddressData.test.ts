import {
    makeAddressId,
    useCallApiAtOnEvents,
    useGetAddressData,
    useGetAppSettingData,
    useGetSavedAddressData,
    useGetSavedAddressOptions
} from 'src/hooks';
import {Constants, defaultAddressState} from 'src/constants';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {validateBillingAddress, validateShippingAddress} from 'src/library';
import {actionUpdateAddress} from 'src/action';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/library/validateBillingAddress');
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked(useCallApiAtOnEvents, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);
const useGetAddressDataMock = mocked(useGetAddressData, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);
const validateBillingAddressMock = mocked(validateBillingAddress, true);

describe('Testing hook useGetSavedAddressData', () => {
    const debounceMock = jest.fn();
    const getTermValue = 'test-value';
    const target ={target: {value: ''}};
    const shippingAddress = initialDataMock.application_state.addresses.shipping;
    const billingAddress = initialDataMock.application_state.addresses.billing;
    const savedAddresses: Array<Partial<IAddress>> = [
        {id: '1', ...shippingAddress},
        {id: '2', ...billingAddress}
    ];
    const validateBillingAddressThunkMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetAppSettingDataMock.mockReturnValueOnce('same');
        validateBillingAddressMock.mockReturnValue(validateBillingAddressThunkMock);
    });

    const hookData = [
        {type: Constants.SHIPPING, address: [], label: 'Select an address', placeholder: 'Enter a new address', expected: []},
        {type: Constants.SHIPPING, address: [shippingAddress], label: 'Select an address', placeholder: 'Select an address', expected: [{value: `0__${shippingAddress.address_line_1.toLowerCase().replace(/\s/g, '') || 'incomplete'}`, name: shippingAddress.address_line_1}]},
        {type: Constants.BILLING, address: [], label: 'Select an address', placeholder: 'Enter a new address', expected: []},
        {type: Constants.BILLING, address: [billingAddress], label: 'Select an address', placeholder: 'Select an address', expected: [{value: `0__${billingAddress.address_line_1.toLowerCase().replace(/\s/g, '')}`, name: billingAddress.address_line_1}]},
        {type: Constants.BILLING, address: [{...billingAddress, address_line_1: ''}], label: 'Select an address', placeholder: 'Select an address', expected: [{value: `0__${'incomplete'}`, name: 'Incomplete address #1'}]},
    ];

    const addressTypes = [
        {type: Constants.SHIPPING, dispatchCountFirst: 8, dispatchCountSecond: 16, dispatchCountThird: 18},
        {type: Constants.BILLING, dispatchCountFirst: 6, dispatchCountSecond: 12, dispatchCountThird: 14},
    ];

    test.each(hookData)(
        'rendering the hook properly ($type, $address)',
        ({type, address, label, placeholder, expected}) => {
            useCallApiAtOnEventsMock.mockReturnValueOnce(false);
            useGetSavedAddressOptionsMock.mockReturnValueOnce(address);
            getTermMock
                .mockReturnValueOnce(label)
                .mockReturnValueOnce(placeholder);

            const {result} = renderHook(() => useGetSavedAddressData(type));

            expect(result.current.label).toStrictEqual('Select an address');
            if(result.current.savedAddresses.length){
                expect(result.current.placeholder).toStrictEqual('Select an address');
            }else{
                expect(result.current.placeholder).toStrictEqual('Enter a new address');
            }

            expect(result.current.id).toStrictEqual(type+'-saved-address-select');
            expect(result.current.options).toStrictEqual(expected);
            expect(result.current.selectedOptionId).toStrictEqual(undefined);

            expect(mockDispatch).toBeCalledTimes(0);
            result.current.handleChange(target);
            expect(mockDispatch).toBeCalledTimes(1);
            expect(debounceMock).toBeCalledTimes(0);
        }
    );

    test.each(addressTypes)('rendering the hook with api calls and type $type', ({type, dispatchCountFirst, dispatchCountSecond, dispatchCountThird}) => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
        mockDispatch.mockReturnValue(Promise.resolve());

        const {result} = renderHook(() => useGetSavedAddressData(type));

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange({target: {value: savedAddresses[0].id}});
        expect(mockDispatch).toBeCalledTimes(dispatchCountFirst);
        result.current.handleChange({target: {value: savedAddresses[1].id}});
        expect(mockDispatch).toBeCalledTimes(dispatchCountSecond);
        result.current.handleChange({target: {value: 'Enter a new address'}});
        expect(mockDispatch).toBeCalledTimes(dispatchCountThird);
        expect(debounceMock).toBeCalledTimes(0);
    });

    const selectedAddressIdData = [
        {
            name: 'Address equal to savedAddresses[0]',
            currentAddress: savedAddresses[0],
            expected: `0__${savedAddresses[0].address_line_1?.toLowerCase().replace(/\s/g, '') || 'incomplete'}`,
        },
        {
            name: 'Address equal to savedAddresses[0] with case differences',
            currentAddress: {
                ...savedAddresses[0],
                address_line_1: savedAddresses[0]?.address_line_1?.toUpperCase() + ' ',
            },
            expected: `0__${savedAddresses[0].address_line_1?.toLowerCase().replace(/\s/g, '') || 'incomplete'}`,
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
            expected: `0__${savedAddresses[0].address_line_1?.toLowerCase().replace(/\s/g, '') || 'incomplete'}`,
        },
        {
            name: 'Address equal to savedAddresses[0] even when province name are different',
            currentAddress: {
                ...savedAddresses[0],
                province: 'Incorrect',
            },
            expected: `0__${savedAddresses[0].address_line_1?.toLowerCase().replace(/\s/g, '') || 'incomplete'}`,
        },
    ];

    describe.each(addressTypes)('For $type addresses', ({type}) => {
        test.each(selectedAddressIdData)(
            'selectedAddressId is properly set ($name)',
            ({currentAddress, expected}) => {
                useCallApiAtOnEventsMock.mockReturnValueOnce(false);
                useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
                useGetAddressDataMock.mockReturnValueOnce(currentAddress as IAddress);

                const {result} = renderHook(() => useGetSavedAddressData(type));

                expect(result.current.selectedOptionId).toStrictEqual(expected);
            }
        );
    });

    test.each(addressTypes)('ids are proper for $type addresses', ({type}) => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(false);
        useGetSavedAddressOptionsMock.mockReturnValueOnce([
            {
                ...savedAddresses[0],
                address_line_1: '',
            } as IAddress,
            savedAddresses[1] as IAddress,
        ]);

        const {result} = renderHook(() => useGetSavedAddressData(type));

        expect(result.current.options).toEqual([
            {
                name: 'Incomplete address #1',
                value: '0__incomplete',
            },
            {
                name: '100 Main Street',
                value: '1__100mainstreet',
            },
        ]);
    });

    describe(`Given API calls are enabled, when called with type ${Constants.BILLING}`, () => {
        beforeEach(() => {
            useCallApiAtOnEventsMock.mockReturnValueOnce(true);
            useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);

            const {result} = renderHook(() => useGetSavedAddressData(Constants.BILLING));
            result.current.handleChange({target: {value: savedAddresses[0].id}});
        });

        test('Emits an update-billing-address action to Redux', () => {
            expect(mockDispatch).toHaveBeenCalledWith(actionUpdateAddress(Constants.BILLING, defaultAddressState));
        });

        test('Calls the validateBillingAddress thunk', () => {
            expect(validateBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(validateBillingAddressMock).toHaveBeenCalledWith(false);
        });

        test('Does not call the validateShippingAddress thunk', () => {
            expect(mockDispatch).not.toHaveBeenCalledWith(validateShippingAddress);
        });
    });

    test('Testing makeAddressId function with identical address ', () => {
        const address1 = {...shippingAddress};
        const address2 = {...shippingAddress};
        const addresses = [address1, address2];
        const ids = addresses.map((address, index) => makeAddressId(address, index));
        expect(ids[0]).not.toStrictEqual(ids[1]);
    });
});
