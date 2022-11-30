import {getFieldNamesSummary} from 'src/utils';
import {Constants} from 'src/constants';

describe('Test getFieldNamesSummary function', () => {
    const fieldNames = [
        [Constants.SHIPPING_TOGGLE, {content: 'description', amount: 'amount', id: ''}],
        [Constants.TAXES_TOGGLE, {content: 'name', amount: 'value', id: ''}],
        [Constants.PAYMENTS_TOGGLE, {content: 'brand', amount: 'amount', id: 'id'}],
        [Constants.DISCOUNTS_TOGGLE, {content: 'code', amount: 'value', id: 'code'}],
        [Constants.FEES_TOGGLE, {content: 'line_text', amount: 'value', id: 'id'}],
        ['anything else', {content: '', amount: '', id: ''}],
        ['', {content: '', amount: '', id: ''}],
    ];
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(fieldNames)('%s constant field name', (fieldName, expectedFieldNames) => {
        const returned = getFieldNamesSummary(fieldName as string);
        expect(returned).toStrictEqual(expectedFieldNames);
    });
});
