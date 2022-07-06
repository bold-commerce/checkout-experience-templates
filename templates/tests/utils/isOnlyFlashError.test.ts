import {isOnlyFlashError} from 'src/utils';

describe('testing isOnlyFlashError', () => {
    const flashError = [
        {
            address_type: '',
            field: 'discountsFlash',
            message: 'one or more discount code are removed.',
            severity: 'validation',
            sub_type: 'discounts',
            type: 'validation',
        }
    ];

    const error = [
        {
            address_type: '',
            field: 'postal_code',
            message: 'The code field is required.',
            severity: 'validation',
            sub_type: '',
            type: 'order',
        }
    ];

    const data = [
        {name: 'with no error', errors: [], expected: true},
        {name: 'with flash error', errors: flashError, expected: true},
        {name: 'with normal error', errors: error, expected: false}
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(data)('$name', async ({name, expected, errors}) => {
        const result = isOnlyFlashError(errors);
        expect(result).toBe(expected);
    });
});
