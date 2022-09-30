import {hasEmptyRequiredFields} from 'src/utils';

describe('testing hasEmptyRequiredFields', () => {

    const dataArray = [
        {
            name: 'test non-empty object ',
            required_fields: ["address", "postal_code"],
            data: {address: 'test', postal_code: 'test'},
            expected: false
        },
        {
            name: 'test empty object ',
            required_fields: ["address", "postal_code"],
            data: { address: '', postal_code: ''},
            expected: true
        },
        {
            name: 'test partial empty object ',
            required_fields: ["address", "postal_code"],
            data: {address: 'test', postal_code: ''},
            expected: true
        },
        {
            name: 'test undefined object ',
            required_fields: ["address", "postal_code"],
            data: {address: undefined, postal_code: ''},
            expected: true
        },
        {
            name: 'test null object ',
            required_fields: ["address", "postal_code"],
            data: null,
            expected: true
        },
        {
            name: 'test undefined object ',
            required_fields: ["address", "postal_code"],
            data: undefined,
            expected: true
        },
    ];


    test.each(dataArray)( '$name', async ({required_fields, data, expected}) => {
        const result = hasEmptyRequiredFields(required_fields, data);
        expect(result).toBe(expected);
    });
});
