import { mocked } from 'jest-mock';
import { IAddress, getOrderInitialData } from '@boldcommerce/checkout-frontend-library';
import { formatCheckoutAddressFromMeta } from 'src/themes/flow-sdk/meta';
import { IMetaPaymentAddress } from 'src/themes/flow-sdk/types';
import { initialDataMock, emptyAddressMock } from 'src/mocks';
import { MetaAddressPlaceholders } from 'src/themes/flow-sdk/constants';


jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
const getOrderInitialDataMock = mocked(getOrderInitialData, true);


describe('formatCheckoutAddressFromMeta', () => {
    beforeAll(() => {
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
    });

    it('should format address with all fields', () => {
        getOrderInitialDataMock.mockReturnValue(initialDataMock.initial_data);
        const address: IMetaPaymentAddress = {
            addressLine: ['123 Main St', 'Apt 4'],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            postalCode: '12345',
            recipient: 'John Doe',
            phone: '555-555-5555',
            organization: 'Acme Inc',
        };

        const expected: IAddress = {
            first_name: 'John',
            last_name: 'Doe',
            address_line_1: '123 Main St',
            address_line_2: 'Apt 4',
            country: 'United States',
            city: 'Anytown',
            province: 'California',
            country_code: 'US',
            province_code: 'CA',
            postal_code: '12345',
            business_name: 'Acme Inc',
            phone_number: '555-555-5555',
        };

        expect(formatCheckoutAddressFromMeta(address)).toEqual(expected);
    });

    it('should format address with placeholder data for missing fields', () => {
        const address: IMetaPaymentAddress = {
            addressLine: ['', 'Apt 4'],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            postalCode: '12345',
            recipient: '',
            phone: '',
            organization: 'Acme Inc',
        };

        const expected: IAddress = {
            first_name: MetaAddressPlaceholders.first_name,
            last_name: MetaAddressPlaceholders.last_name,
            address_line_1: MetaAddressPlaceholders.address_line_1,
            address_line_2: 'Apt 4',
            country: 'United States',
            city: 'Anytown',
            province: 'California',
            country_code: 'US',
            province_code: 'CA',
            postal_code: '12345',
            business_name: 'Acme Inc',
            phone_number: MetaAddressPlaceholders.phone_number,
        };

        expect(formatCheckoutAddressFromMeta(address, true)).toEqual(expected);
    });

    it('should handle blank address', () => {
        const address: IMetaPaymentAddress = {
            addressLine: [],
            city: '',
            region: '',
            country: '',
            postalCode: '',
            recipient: '',
            phone: '',
            organization: '',
        };

        expect(formatCheckoutAddressFromMeta(address)).toEqual(emptyAddressMock);
    });

    it('should handle undefined address', () => {
        expect(formatCheckoutAddressFromMeta(undefined)).toEqual(emptyAddressMock);
    });
});