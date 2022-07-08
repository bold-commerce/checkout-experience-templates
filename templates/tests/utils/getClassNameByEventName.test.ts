import {getClassNameByEventName} from 'src/utils';
import {Constants} from 'src/constants';

describe('Testing the return of getClassNameByEventName function', () => {
    const eventNames = [
        [Constants.SHIPPING_TOGGLE, 'shipping'],
        [Constants.TAXES_TOGGLE, 'taxes'],
        [Constants.PAYMENTS_TOGGLE, 'payments'],
        [Constants.DISCOUNTS_TOGGLE, 'discounts'],
        [Constants.SUBTOTAL_EVENT, 'subtotal'],
        [Constants.TOTAL_EVENT, 'total'],
        [Constants.AMOUNT_DUE_EVENT, 'amount-due'],
        [Constants.FEES_TOGGLE, 'fees'],
        ['something else', ''],
        ['', '']
    ];

    test.each(eventNames)('Testing %s event', (eventName, expectedClassName) => {
        const returned = getClassNameByEventName(eventName);
        expect(returned).toStrictEqual(expectedClassName);
    });
});
