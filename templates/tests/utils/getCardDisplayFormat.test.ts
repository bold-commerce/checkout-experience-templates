import {getCardDisplayFormat} from 'src/utils';

describe('Testing function getCardDisplayFormat', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {
            testName: 'empty brand and lineText',
            brand: '',
            lineText: '',
            expected: ''
        },
        {
            testName: 'empty lineText',
            brand: 'Visa',
            lineText: '',
            expected: 'Visa'
        },
        {
            testName: 'empty brand',
            brand: '',
            lineText: '1234',
            expected: '1234'
        },
        {
            testName: 'Any brand not in constants',
            brand: 'Some Brand',
            lineText: 'Some Line Text',
            expected: 'Some Line Text'
        },
        {
            testName: 'Any brand in the OTHER array',
            brand: 'Dinersclub',
            lineText: '1111',
            expected: '•••• •••• •••• 1111'
        },
        {
            testName: 'Any brand in the AMEX array',
            brand: 'American-Express',
            lineText: '2222',
            expected: '•••• •••••• 2222'
        },
    ];

    test.each(data)('rendering hook with lineText populated - $testName', ({testName, brand, lineText, expected}) => {
        const result = getCardDisplayFormat(brand, lineText);
        expect(result).toStrictEqual(expected)
    });
});
