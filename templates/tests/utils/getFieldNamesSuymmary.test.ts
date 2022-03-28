import {getFieldNamesSummary} from 'src/utils';
import {Constants} from 'src/constants';
import {IFieldNamesSummary} from 'src/types';

describe('Test getFieldNamesSummary function', () => {
    const fieldNames = [
        [Constants.SHIPPING_TOGGLE, {content: 'description', amount: 'amount', id: ''}],
        [Constants.TAXES_TOGGLE, {content: 'name', amount: 'value', id: ''}],
        [Constants.PAYMENTS_TOGGLE, {content: 'brand', amount: 'value', id: 'id'}],
        [Constants.DISCOUNTS_TOGGLE, {content: 'code', amount: 'value', id: 'code'}],
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