import { renderHtmlEntities } from "src/utils";

describe('Test renderHtmlEntities function', () => {
    const dataArray = [
        { input: '&euro;', expected: '€'},
        { input: '&cent;', expected: '¢'},
        { input: '&#8361;', expected: '₩'},
        { input: '&curren;', expected: '¤'},
        { input: '&pound;{{amount}}', expected: '£{{amount}}'},
        { input: '&#165;{{amount_no_decimal}} JPY', expected: '¥{{amount_no_decimal}} JPY'},
        { input: '', expected: ''}
    ]

    test.each(dataArray)('HTML entity: $input', ({input, expected})  => {
        expect(renderHtmlEntities(input)).toEqual(expected);
    });
});