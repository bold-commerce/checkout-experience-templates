import { getFirstAddressLine, getSecondAddressLine } from 'src/themes/flow-sdk/lib/address';

describe('getFirstAddressLine', () => {
    it('should return first address line if it exists', () => {
        const address = {
            addressLine: ['123 Main St', 'Apt 4'],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            recipient: 'John Doe',
            phone: '555-555-5555',
            organization: 'Acme Inc',
            postalCode: '12345',
        };

        const expected = '123 Main St';

        expect(getFirstAddressLine(address)).toEqual(expected);
    });

    it('should return empty string if first address line does not exist', () => {
        const address = {
            addressLine: [],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            recipient: 'John Doe',
            phone: '555-555-5555',
            organization: 'Acme Inc',
            postalCode: '12345',
        };

        const expected = '';

        expect(getFirstAddressLine(address)).toEqual(expected);
    });

    it('should return empty string if address is undefined', () => {
        const address = undefined;

        const expected = '';

        expect(getFirstAddressLine(address)).toEqual(expected);
    });
});

describe('getSecondAddressLine', () => {
    it('should return second address line if it exists', () => {
        const address = {
            addressLine: ['123 Main St', 'Apt 4'],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            recipient: 'John Doe',
            phone: '555-555-5555',
            organization: 'Acme Inc',
            postalCode: '12345',
        };

        const expected = 'Apt 4';

        expect(getSecondAddressLine(address)).toEqual(expected);
    });

    it('should return empty string if second address line does not exist', () => {
        const address = {
            addressLine: ['123 Main St'],
            city: 'Anytown',
            region: 'CA',
            country: 'US',
            recipient: 'John Doe',
            phone: '555-555-5555',
            organization: 'Acme Inc',
            postalCode: '12345',
        };

        const expected = '';

        expect(getSecondAddressLine(address)).toEqual(expected);
    });

    it('should return empty string if address is undefined', () => {
        const address = undefined;

        const expected = '';

        expect(getSecondAddressLine(address)).toEqual(expected);
    });
});