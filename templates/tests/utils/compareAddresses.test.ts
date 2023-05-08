import { IAddress } from '@boldcommerce/checkout-frontend-library';
import { compareAddresses } from 'src/utils';

type Data = {
    name: string;
    address1: Partial<IAddress> | undefined;
    address2: Partial<IAddress> | undefined;
    shouldMatch: boolean;
}

describe('Test compareAddress function', () => {
    const testData: Data[] = [
        {
            name: 'Exact address',
            address1: {
                address_line_1: '123 Main St',
                city: 'Anytown',
                province_code: 'ON',
                postal_code: '12345',
            },
            address2: {
                address_line_1: '123 Main St',
                city: 'Anytown',
                province_code: 'ON',
                postal_code: '12345',
            },
            shouldMatch: true,
        },
        {
            name: 'Address line 1 differs',
            address1: {
                address_line_1: '123 Main St',
            },
            address2: {
                address_line_1: '456 Main St',
            },
            shouldMatch: false,
        },
        {
            name: 'Mixed abbreviations',
            address1: {
                address_line_1: '123 Main St',
            },
            address2: {
                address_line_1: '123 Main Street',
            },
            shouldMatch: true,
        },
        {
            name: 'Mixed case',
            address1: {
                address_line_1: '123 Main St',
                city: 'Anytown',
            },
            address2: {
                address_line_1: '123 main st',
                city: 'AnyTown',
            },
            shouldMatch: true,
        },
        {
            name: 'Abbreviations with . on one but not other',
            address1: {
                address_line_1: '123 Main St.',                
            },
            address2: {
                address_line_1: '123 Main St',                
            },
            shouldMatch: true,
        },
        {
            name: 'Alot of abbreviations',
            address1: {
                address_line_1: '123 Main St. Blvd Ave lK. West',
                address_line_2 : 'Suite apt. 100',
                city: 'Anytown',
            },
            address2: {
                address_line_1: '123 Main street boulevard avenue lake w',
                address_line_2 : 'ste. appt. 100',
                city: 'anytown',
            },
            shouldMatch: true,
        },
        {
            name: 'Blank address',
            address1: {
                address_line_1: '',
                city: '',
                province_code: '',
                postal_code: ''
            },
            address2: {
                address_line_1: '123 Main St',
                city: 'Anytown',
                province_code: 'ON',
                postal_code: '12345',
            },
            shouldMatch: false,
        },
        {
            name: 'Falsey matching',
            address1: {
                address_line_1: undefined,
            },
            address2: {
                address_line_1: '',
            },
            shouldMatch: true,
        },
        {
            name: 'Undefined field in address2',
            address1: {
                address_line_1: '123 Address',
            },
            address2: {},
            shouldMatch: false,
        },
        {
            name: 'Matching by province_code when province doesn\'t match',
            address1: {
                province: '1',
                province_code: 'ON',
            },
            address2: {
                province: '2',
                province_code: 'ON',
            },
            shouldMatch: true,
        },
        {
            name: 'Matching by province_code when province_code is undefined',
            address1: {
                province: '1',
            },
            address2: {
                province: '2',
            },
            shouldMatch: false,
        },
        {
            name: 'Matching by country_code when country doesn\'t match',
            address1: {
                country: '1',
                country_code: 'CA',
            },
            address2: {
                country: '2',
                country_code: 'CA',
            },
            shouldMatch: true,
        },
        {
            name: 'Matching by country_code when country_code is undefined',
            address1: {
                country: '1',
            },
            address2: {
                country: '2',
            },
            shouldMatch: false,
        },
        {
            name: 'Address2 is undefined',
            address1: {
                address_line_1: '123 Fake St.',
            },
            address2: undefined,
            shouldMatch: false,
        },
        {
            name: 'Both addresses are undefined',
            address1: undefined,
            address2: undefined,
            shouldMatch: true,
        },
        {
            name: 'Address with ID as number. ID should be ignored',
            address1: {
                id: 1 as unknown as string,
                address_line_1: '123 Fake st'
            }, 
            address2: {
                id: 2 as unknown as string,
                address_line_1: '123 fake street'
            },
            shouldMatch: true,
        },
        {
            name: 'Address1 doesn\'t have fields that address2 has',
            address1: {}, 
            address2: {
                address_line_1: '123 fake st',
            },
            shouldMatch: false,
        },
        {
            name: 'Addresses have none string field that match',
            address1: {
                address_line_2: 1 as unknown as string,
            }, 
            address2: {
                address_line_2: 1 as unknown as string,
            },
            shouldMatch: true,
        },
        {
            name: 'Addresses have none string field that don\'t match',
            address1: {
                address_line_2: 1 as unknown as string,
            }, 
            address2: {
                address_line_2: 2 as unknown as string,
            },
            shouldMatch: false,
        },
    ];

    test.each(testData)('Comparing addresses ($name)', ({
        address1,
        address2,
        shouldMatch,
    }) => {
        const result = compareAddresses(address1, address2);

        expect(result).toBe(shouldMatch);
    });
});
