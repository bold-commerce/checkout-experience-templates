import {isOnlyDiscountCodeError} from 'src/utils';

const errors = [];

describe('testing isOnlyDiscountCodeError', () => {
    const discountErrors = [
        {
            return1: true,
            return2: false,
            errors: [{
                address_type: '',
                field: 'code',
                message: 'The code field is required.',
                severity: 'validation',
                sub_type: '',
                type: 'authorization',
            }]
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('call with no errors', async () => {
        const result = isOnlyDiscountCodeError(errors);
        expect(result).toBe(false);
    });

    test('call with error array length > 1', async () => {
        const twoErrors = [
            discountErrors[0].errors[0],
            discountErrors[0].errors[0]
        ];
        const result = isOnlyDiscountCodeError(twoErrors);
        expect(result).toBe(false);
    });

    test('call with error array length = 1 and error is not Discount Error', async () => {
        const oneError = [{
            address_type: 'some address_type',
            field: 'some field',
            message: 'some message',
            severity: 'some severity',
            sub_type: 'some subtype',
            type: 'some type',
        }];
        const result = isOnlyDiscountCodeError(oneError);
        expect(result).toBe(false);
    });

    test.each(discountErrors)('call with error array length = 1 and error is one Discount Error', async ({return1, return2, errors}) => {
        const result = isOnlyDiscountCodeError(errors);
        expect(result).toBe(true);
    });
});
