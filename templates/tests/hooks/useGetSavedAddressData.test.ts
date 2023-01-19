import {
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
import {IAddress} from '@bold-commerce/checkout-frontend-library';
import { validateBillingAddress, validateShippingAddress } from 'src/library';
import { actionUpdateAddress } from 'src/action';

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
    const shippingAddress = initialDataMock.application_state.addresses.shipping;
    const billingAddress = initialDataMock.application_state.addresses.billing;
    const savedAddresses: Array<Partial<IAddress>> = [
        {id: '1', ...shippingAddress},
        {id: '2', ...billingAddress}
    ];
 
    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
        useGetAppSettingDataMock.mockReturnValueOnce('same');
    });

    const hookData = [
        {type: Constants.SHIPPING, address: [], label: "Select an address", placeholder: "Enter a new address", expected: []},
        {type: Constants.SHIPPING, address: [shippingAddress], label: "Select an address", placeholder: "Select an address", expected: [{value: `${shippingAddress.id}__${shippingAddress.address_line_1 || 'incomplete'}`, name: shippingAddress.address_line_1}]},
        {type: Constants.BILLING, address: [], label: "Select an address", placeholder: "Enter a new address", expected: []},
        {type: Constants.BILLING, address: [billingAddress], label: "Select an address", placeholder: "Select an address", expected: [{value: `${billingAddress.id}__${billingAddress.address_line_1}`, name: billingAddress.address_line_1}]},
        {type: Constants.BILLING, address: [{ ...billingAddress, address_line_1: '' }], label: "Select an address", placeholder: "Select an address", expected: [{value: `${billingAddress.id}__${'incomplete'}`, name: 'Incomplete address #1'}]},
    ];

    const addressTypes = [
        { type: Constants.SHIPPING },
        { type: Constants.BILLING },
    ];

    test.each(hookData)(
        'rendering the hook properly ($type, $address)',
        ({type, address, label, placeholder, expected}) => {
            useCallApiAtOnEventsMock.mockReturnValueOnce(false);
            useGetSavedAddressOptionsMock.mockReturnValueOnce(address);
            getTermMock
            .mockReturnValueOnce(label)
            .mockReturnValueOnce(placeholder)
          
            const {result} = renderHook(() => useGetSavedAddressData(type));
        
            expect(result.current.label).toStrictEqual("Select an address");
            if(result.current.savedAddresses.length){
                expect(result.current.placeholder).toStrictEqual("Select an address");
            }else{
                expect(result.current.placeholder).toStrictEqual("Enter a new address");
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

    test.each(addressTypes)('rendering the hook with api calls and type $type', ({ type }) => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);
        useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
        mockDispatch.mockReturnValue(Promise.resolve());

        const {result} = renderHook(() => useGetSavedAddressData(type));

        expect(mockDispatch).toBeCalledTimes(0);
        result.current.handleChange({target: {value: savedAddresses[0].id}});
        expect(mockDispatch).toBeCalledTimes(6);
        result.current.handleChange({target: {value: savedAddresses[1].id}});
        expect(mockDispatch).toBeCalledTimes(12);
        result.current.handleChange({target: {value: 'new'}});
        expect(mockDispatch).toBeCalledTimes(14);
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

    describe.each(addressTypes)('For $type addresses', ({ type }) => {
        test.each(selectedAddresIdData)(
            'selectedAddressId is properly set ($name)',
            ({ currentAddress, expected }) => {
                useCallApiAtOnEventsMock.mockReturnValueOnce(false);
                useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);
                useGetAddressDataMock.mockReturnValueOnce(currentAddress as IAddress);

                const { result } = renderHook(() => useGetSavedAddressData(type));

                expect(result.current.selectedOptionId).toStrictEqual(expected);
            }
        );
    });

    test.each(addressTypes)('ids are proper for $type addresses', ({ type }) => {
        useCallApiAtOnEventsMock.mockReturnValueOnce(false);
        useGetSavedAddressOptionsMock.mockReturnValueOnce([
            {
                ...savedAddresses[0],
                address_line_1: '',
            } as IAddress,
            savedAddresses[1] as IAddress,
        ]);

        const { result } = renderHook(() => useGetSavedAddressData(type));

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

    describe(`Given API calls are enabled, when called with type ${Constants.BILLING}`, () => {
        beforeEach(() => {
            useCallApiAtOnEventsMock.mockReturnValueOnce(true);
            useGetSavedAddressOptionsMock.mockReturnValueOnce(savedAddresses as Array<IAddress>);

            const { result } = renderHook(() => useGetSavedAddressData(Constants.BILLING));
            result.current.handleChange({ target: { value: savedAddresses[0].id }});
        });

        test('Emits an update-billing-address action to Redux', () => {
            expect(mockDispatch).toHaveBeenCalledWith(actionUpdateAddress(Constants.BILLING, defaultAddressState));
        });

        test('Calls the validateBillingAddress thunk', () => {
            expect(mockDispatch).toHaveBeenCalledWith(validateBillingAddress);
        });

        test('Does not call the validateShippingAddress thunk', () => {
            expect(mockDispatch).not.toHaveBeenCalledWith(validateShippingAddress);
        });
    });
});
