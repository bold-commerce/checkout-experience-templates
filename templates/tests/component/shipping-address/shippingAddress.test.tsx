import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {ShippingAddress} from 'src/components';
import {getTerm} from 'src/utils';
import {initialDataMock, storeMock} from 'src/mocks';
import {useGetAddressCountryInputData, useGetAddressPostalCodeAndProvinceData, useGetCustomerInfoData, useLogin} from 'src/hooks';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetAddressPostalCodeAndProvinceData');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useLogin');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAddressCountrySelectData');
jest.mock('src/utils');
const useLoginMock = mocked(useLogin, true);
const useGetAddressPostalCodeAndProvinceDataMock = mocked(useGetAddressPostalCodeAndProvinceData, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetAddressCountryInputDataMock = mocked(useGetAddressCountryInputData, true);
const getTermMock = mocked(getTerm, true);


describe('Testing ShippingAddress component', () => {

    beforeEach(() =>{
        jest.resetAllMocks();
        getTermMock.mockReturnValue('');
        useGetAddressPostalCodeAndProvinceDataMock.mockReturnValue({province: [], provinceLabel:'', showProvince:false, showPostalCode:false });
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useLoginMock.mockReturnValue({
            loginUrl: jest.fn(),
            handleCheckboxChange: jest.fn(),
            acceptMarketingChecked: true,
            email: 'test',
            acceptMarketingHidden: false
        });
        useGetAddressCountryInputDataMock.mockReturnValue({
            placeholder: '',
            id: '1',
            name: 'test',
            value: 'test',
            handleChange: jest.fn(),
            countryOptions: [],
            countryName: '',
            label: ''
        });
    });

    test('Render the Address properly', () => {
        const {container} = render(<ShippingAddress/>);
        expect(container.getElementsByClassName('shipping-address').length).toBe(1);
        expect(container.getElementsByClassName('address').length).toBe(1);

    });
});
