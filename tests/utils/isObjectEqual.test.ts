import {isObjectEquals} from 'src/utils';

describe('testing isObjectEqual', () => {
    const testFunction = jest.fn();
    const regExpression = new RegExp('same');
    const addressTest = {address: '101 street', postal_code: '123456'};
    const addressTestDifferent =  {postal_code: '123456', address: '1001 street'};
    const addressTestReversed =  {postal_code: '123456', address: '101 street'};

    const dataSet = [
        {
            name: 'Passing object with null',
            var1: null,
            var2: 'var2',
            expected: false
        },
        {
            name: 'Passing object with undefined',
            var1: undefined,
            var2: 'var2',
            expected: false
        },
        {
            name: 'Passing same object',
            var1: addressTest,
            var2: addressTestReversed,
            expected: true
        },
        {
            name: 'Passing same object with different value',
            var1: addressTest,
            var2: addressTestDifferent,
            expected: false
        },
        {
            name: 'Passing same date object',
            var1: new Date(2018,11,21),
            var2: new Date(2018,11,21),
            expected: true
        },
        {
            name: 'Passing different date object',
            var1: new Date(2018,11,21),
            var2: new Date(2018,11,24),
            expected: false
        },
        {
            name: 'Passing different contructor',
            var1: new Date(2018,11,21),
            var2: {constructor: 'test'},
            expected: false
        },
        {
            name: 'Passing different function',
            var1: testFunction,
            var2: jest.fn(),
            expected: false
        },
        {
            name: 'Passing same function',
            var1: testFunction,
            var2: testFunction,
            expected: true
        },
        {
            name: 'Passing different arrow function',
            var1: () => {return 'test';},
            var2: () => {return 'test2';},
            expected: false
        },
        {
            name: 'Passing same RegularExpression',
            var1: regExpression,
            var2: regExpression,
            expected: true
        },
        {
            name: 'Passing different RegularExpression',
            var1: new RegExp('diffent'),
            var2: regExpression,
            expected: false
        },
        {
            name: 'Passing same Array',
            var1: [1,2,3,4,5],
            var2: [1,2,3,4,5],
            expected: true
        },
        {
            name: 'Passing different Array',
            var1: [1,2,3,4,5],
            var2: [1,2,3,4,5,6],
            expected: false
        },
        {
            name: 'Passing different objects',
            var1: new Object(1),
            var2: 1.4,
            expected: false
        },
    ];

    test.each(dataSet)(
        '$name',
        ({var1, var2, expected}) => {
            const result = isObjectEquals(var1, var2);
            expect(result).toStrictEqual(expected);
        });
});
