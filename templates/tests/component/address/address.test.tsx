import {IAddressProps, ISavedAddressHookProps} from 'src/types';
import {Constants} from 'src/constants';
import {render} from '@testing-library/react';
import {Address} from 'src/components';
import {mocked} from 'jest-mock';
import {
    useDebouncedValidateAddress,
    useGetAddressCountryInputData,
    useGetAddressPostalCodeAndProvinceData,
    useGetAddressProvinceInputData,
    useGetCustomerInfoData,
    useGetErrorByField,
    useGetGeneralSettingCheckoutFields,
    useGetSavedAddressData,
    useInitiateGenericAutocomplete
} from 'src/hooks';
import {initialDataMock, storeMock} from 'src/mocks';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {getTerm} from 'src/utils';


jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
jest.mock('src/hooks/useInitiateGenericAutocomplete');
jest.mock('src/hooks/useDebounceValidateAddress');
jest.mock('src/hooks/useGetAddressPostalCodeAndProvinceData');
jest.mock('src/hooks/useGetSavedAddressData');
jest.mock('src/hooks/useGetAddressCountrySelectData');
jest.mock('src/hooks/useGetAddressProvinceSelectData');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/utils/getTerm');
const useDebouncedValidateAddressMock = mocked(useDebouncedValidateAddress, true);
const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);
const useInitiateGenericAutocompleteMock = mocked(useInitiateGenericAutocomplete, true);
const useGetAddressPostalCodeAndProvinceDataMock = mocked(useGetAddressPostalCodeAndProvinceData, true);
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);
const useGetAddressCountryInputDataMock = mocked(useGetAddressCountryInputData, true);
const useGetAddressProvinceInputDataMock = mocked(useGetAddressProvinceInputData, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const getTermMock = mocked(getTerm, true);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

describe('Testing Address component', () => {
    const props: IAddressProps = {
        type: Constants.SHIPPING,
        title: 'test',
        showTitle: true,
        showSavedAddresses: true
    };
    const savedAddresses: Array<IAddress> = [
        {...initialDataMock.application_state.addresses.shipping, id: '1'} as IAddress,
        {...initialDataMock.application_state.addresses.billing, id: '2'} as IAddress
    ];
    const savedAddressData: ISavedAddressHookProps = {
        placeholder: 'test',
        title: 'test',
        label: 'test-label',
        selectedOptionId: undefined,
        id: 'test-id',
        options: [],
        savedAddresses: savedAddresses,
        handleChange: jest.fn()
    };

    beforeEach(() =>{
        jest.resetAllMocks();
        useGetAddressPostalCodeAndProvinceDataMock.mockReturnValue({
            province: [], provinceLabel:'', showProvince:true, showPostalCode:true
        });
        useGetSavedAddressDataMock.mockReturnValue(savedAddressData);
        useGetAddressCountryInputDataMock.mockReturnValue({
            placeholder: '', id: '1', name: 'test', value: 'test', handleChange: jest.fn(), countryOptions: [], countryName: '', label: ''
        });
        useGetAddressProvinceInputDataMock.mockReturnValueOnce({
            placeholder: 'test', label: 'test-label', id: 'test-id', name: 'test-name', value: 'option1', provinceName: 'Option 1', showProvince: true, provinceOptions: [], handleChange: jest.fn()
        });
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useGetErrorByFieldMock.mockReturnValue('');
        getTermMock
            .mockReturnValueOnce('First name')
            .mockReturnValueOnce('Last name')
            .mockReturnValueOnce('Company (optional)')
            .mockReturnValueOnce('Company');
    });

    test('Render the Address properly', () => {
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('optional')
            .mockReturnValueOnce(true);

        const { container, getByPlaceholderText } = render(<Address {...props}/>);

        expect(container.getElementsByClassName('address__FieldSection').length).toBe(1);
        expect(container.getElementsByClassName('address__saved-select').length).toBe(1);
        expect(container.getElementsByClassName('address__first').length).toBe(1);
        expect(container.getElementsByClassName('address__last').length).toBe(1);
        expect(container.getElementsByClassName('address__company').length).toBe(1);
        expect(container.getElementsByClassName('address__address').length).toBe(1);
        expect(container.getElementsByClassName('address__address2').length).toBe(1);
        expect(container.getElementsByClassName('address__city').length).toBe(1);
        expect(container.getElementsByClassName('address__country').length).toBe(1);
        expect(container.getElementsByClassName('address__province').length).toBe(1);
        expect(container.getElementsByClassName('address__postal_code').length).toBe(1);
        expect(container.getElementsByClassName('address__phone').length).toBe(1);
        expect(useDebouncedValidateAddressMock).toHaveBeenCalledTimes(1);
        expect(useInitiateGenericAutocompleteMock).toHaveBeenCalledTimes(1);
        expect(useGetGeneralSettingCheckoutFieldsMock).toHaveBeenCalledTimes(2);
        expect(getByPlaceholderText('Company (optional)')).toBeTruthy();
    });

    test('Render the Address properly with hidden fields', () => {
        const localProps = {...props, showSavedAddresses: false};
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('hidden')
            .mockReturnValueOnce(false);

        const { container } = render(<Address {...localProps}/>);

        expect(container.getElementsByClassName('address__hidden').length).toBe(1);
        expect(container.getElementsByClassName('address__saved-select').length).toBe(0);
        expect(useDebouncedValidateAddressMock).toHaveBeenCalledTimes(1);
        expect(useInitiateGenericAutocompleteMock).toHaveBeenCalledTimes(1);
        expect(useGetGeneralSettingCheckoutFieldsMock).toHaveBeenCalledTimes(2);
    });

    test('Render the Address with company mandatory', () => {
        useGetGeneralSettingCheckoutFieldsMock
            .mockReturnValueOnce('required')
            .mockReturnValueOnce(false);

        const { getByPlaceholderText} = render(<Address {...props}/>);

        expect(getByPlaceholderText('Company')).toBeTruthy();
    });
});
