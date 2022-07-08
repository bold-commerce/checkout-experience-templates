import {Constants} from 'src/constants';
import {IFieldNamesSummary} from 'src/types';

export function getFieldNamesSummary(eventName: string): IFieldNamesSummary {
    const fieldNames: IFieldNamesSummary = {content: '', amount: '', id: ''};
    switch (eventName) {
        case Constants.SHIPPING_TOGGLE:
            fieldNames.content = 'description';
            fieldNames.amount = 'amount';
            break;
        case Constants.TAXES_TOGGLE:
            fieldNames.content = 'name';
            fieldNames.amount = 'value';
            break;
        case Constants.PAYMENTS_TOGGLE:
            fieldNames.content = 'brand';
            fieldNames.amount = 'amount';
            fieldNames.id = 'id';
            break;
        case Constants.DISCOUNTS_TOGGLE:
            fieldNames.content = 'code';
            fieldNames.amount = 'value';
            fieldNames.id = 'code';
            break;
        case Constants.FEES_TOGGLE:
            fieldNames.content = 'line_text';
            fieldNames.amount = 'value';
            fieldNames.id = 'id';
            break;
        default:
            break;
    }
    return fieldNames;
}
