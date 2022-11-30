import {isAutocompleteDataPopulated} from 'src/utils';
import {IAutocompleteData} from 'src/types';

describe('Test function isAutocompleteDataPopulated', () => {

    const fullAddress = {
        address1: 'test',
        city: 'test',
        postalCode: 'test',
        province: 'test',
        provinceCode: 'test',
        country: 'test',
        countryCode: 'test'
    } as IAutocompleteData;

    const partialAddress = {
        address1: 'test',
        city: '',
        postalCode: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: ''
    } as IAutocompleteData;

    const emptyAddress = {
        address1: '',
        city: '',
        postalCode: '',
        province: '',
        provinceCode: '',
        country: '',
        countryCode: ''
    } as IAutocompleteData;

    const dataSet = [
        {address: emptyAddress, expected: false},
        {address: partialAddress, expected: false},
        {address: fullAddress, expected: true},
    ];

    test.each(dataSet)(
        'test address: $address, expected: $expected',
        ({address, expected}) => {
            const result = isAutocompleteDataPopulated(address);
            expect(result).toStrictEqual(expected);
        });
});
