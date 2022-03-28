import {getGiftCardDisplayFormat} from 'src/utils';

describe('Testing function getGiftCardDisplayFormat', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {
            testName: 'Gift Card number is an integer',
            giftCardNumber: 12345678901234,
            expected: '1234-5678-9012-34',
        },
        {
            testName: 'Gift Card number is a short string - < 4 characters',
            giftCardNumber: 'ABC',
            expected: 'ABC',
        },
        {
            testName: 'Gift Card number is an empty string',
            giftCardNumber: '',
            expected: '',
        },
        {
            testName: 'Gift Card number is an alphabetic string - > 4 characters',
            giftCardNumber: 'ABCDEFGHIJKLMNOP',
            expected: 'ABCD-EFGH-IJKL-MNOP',
        },
        {
            testName: 'Gift Card number is an alphanumerci string - > 4 characters',
            giftCardNumber: 'AB1234CDEFGH56789J',
            expected: 'AB12-34CD-EFGH-5678-9J',
        },
    ];

    test.each(data)('$testName', ({testName, giftCardNumber, expected}) => {
        const result = getGiftCardDisplayFormat(giftCardNumber.toString());
        expect(result).toStrictEqual(expected);
    });
});
