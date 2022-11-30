import {getClassesListSummary} from 'src/utils';
import {Constants} from 'src/constants';

describe('Test getClassesListSummary function', () => {
    const prefix = 'taxes-amount__';

    const dataSet = [
        {event: Constants.TOTAL_EVENT, expanded: false, bottom: false, list: false},
        {event: Constants.TOTAL_EVENT, expanded: true, bottom: false, list: false},
        {event: Constants.TOTAL_EVENT, expanded: false, bottom: true, list: false},
        {event: Constants.TOTAL_EVENT, expanded: false, bottom: false, list: true},
        {event: Constants.TOTAL_EVENT, expanded: true, bottom: true, list: false},
        {event: Constants.TOTAL_EVENT, expanded: true, bottom: false, list: true},
        {event: Constants.TOTAL_EVENT, expanded: false, bottom: true, list: true},
        {event: Constants.TOTAL_EVENT, expanded: true, bottom: true, list: true},

        {event: Constants.SHIPPING_TOGGLE, expanded: false, bottom: false, list: false},
        {event: Constants.SHIPPING_TOGGLE, expanded: true, bottom: false, list: false},
        {event: Constants.SHIPPING_TOGGLE, expanded: false, bottom: true, list: false},
        {event: Constants.SHIPPING_TOGGLE, expanded: false, bottom: false, list: true},
        {event: Constants.SHIPPING_TOGGLE, expanded: true, bottom: true, list: false},
        {event: Constants.SHIPPING_TOGGLE, expanded: true, bottom: false, list: true},
        {event: Constants.SHIPPING_TOGGLE, expanded: false, bottom: true, list: true},
        {event: Constants.SHIPPING_TOGGLE, expanded: true, bottom: true, list: true},
    ];

    test.each(dataSet)(
        'test Event: $event, isExpanded: $expanded, hasBottom: $bottom, hasList: $list',
        ({event, expanded, bottom, list}) => {
            const eventClasses = (event === Constants.TOTAL_EVENT || event === Constants.AMOUNT_DUE_EVENT) ? 1 : 0
            const listClasses = list ? 1 : 0;
            const bottomClasses = bottom ? 1 : 0;
            let containerLength = 2 + bottomClasses;
            if(!list){
                containerLength++;
            }
            const arrowClass = expanded ? 'arrow--right' : 'arrow--down';
            const priceClass = list ? 'price--when-collapsed' : 'price';

            const result = getClassesListSummary(event, expanded, bottom, list);

            expect(result.container.split(' ').length).toStrictEqual(containerLength);

            expect(result.title.container.split(' ').length).toStrictEqual(3 + listClasses + eventClasses);
            expect(result.title.arrow.split(' ').length).toStrictEqual(2);
            expect(result.title.arrow.split(' ')[1]).toStrictEqual(prefix + arrowClass);
            expect(result.title.text.split(' ').length).toStrictEqual(1);
            expect(result.title.price.split(' ').length).toStrictEqual(1 + eventClasses);
            expect(result.title.price.split(' ')[0]).toStrictEqual(prefix + priceClass);

            expect(result.list.ul.split(' ').length).toStrictEqual(2);
            expect(result.list.li.split(' ').length).toStrictEqual(2);
            expect(result.list.text.split(' ').length).toStrictEqual(3);
            expect(result.list.price.split(' ').length).toStrictEqual(2);
            expect(result.list.delete.split(' ').length).toStrictEqual(1);
            expect(result.list.loading.split(' ').length).toStrictEqual(1);
            expect(result.list.loadingSpan.split(' ').length).toStrictEqual(1);
        });

    test('test with only event', () => {
        const arrowClass = 'arrow--down';
        const priceClass = 'price--when-collapsed';

        const result = getClassesListSummary(Constants.TOTAL_EVENT);

        expect(result.container.split(' ').length).toStrictEqual(2);

        expect(result.title.container.split(' ').length).toStrictEqual(5 );
        expect(result.title.arrow.split(' ').length).toStrictEqual(2);
        expect(result.title.arrow.split(' ')[1]).toStrictEqual(prefix + arrowClass);
        expect(result.title.text.split(' ').length).toStrictEqual(1);
        expect(result.title.price.split(' ').length).toStrictEqual(2);
        expect(result.title.price.split(' ')[0]).toStrictEqual(prefix + priceClass);

        expect(result.list.ul.split(' ').length).toStrictEqual(2);
        expect(result.list.li.split(' ').length).toStrictEqual(2);
        expect(result.list.text.split(' ').length).toStrictEqual(3);
        expect(result.list.price.split(' ').length).toStrictEqual(2);
        expect(result.list.delete.split(' ').length).toStrictEqual(1);
        expect(result.list.loading.split(' ').length).toStrictEqual(1);
        expect(result.list.loadingSpan.split(' ').length).toStrictEqual(1);
    });

});
