import {IPaymentsSummaryClasses} from 'src/types';
import {getClassNameByEventName} from 'src/utils';
import classNames from 'classnames';
import {Constants} from 'src/constants';

export function getClassesListSummary(eventName: string, isExpanded = false, hasBottom = false, hasList = true): IPaymentsSummaryClasses {
    const className = getClassNameByEventName(eventName);
    const textColorClass = classNames([
        (eventName === Constants.TOTAL_EVENT || eventName === Constants.AMOUNT_DUE_EVENT)? 'taxes-amount--black-color' : ''
    ]);

    return {
        container: classNames(['taxes-amount__container', `taxes-amount__${className}`, hasBottom ? 'taxes-amount--border-bottom' : '', hasList ? '' : 'taxes-amount__container--flex-row']),
        title: {
            container: classNames(['taxes-amount__label', 'taxes-amount__label--full-width', hasList ? 'taxes-amount__label--no-padding' : '', `taxes-amount__${className}-label`, textColorClass]),
            arrow: classNames(['taxes-amount__arrow', isExpanded ? 'taxes-amount__arrow--right' : 'taxes-amount__arrow--down']),
            text: classNames(['taxes-amount__label--content-with-arrow']),
            price: classNames([hasList ? 'taxes-amount__price--when-collapsed' : 'taxes-amount__price', textColorClass])
        },
        list: {
            ul: classNames(['taxes-amount__list', `taxes-amount__${className}-list`]),
            li: classNames(['taxes-amount__line', `taxes-amount__${className}-line`]),
            text: classNames(['taxes-amount__label', 'taxes-amount__label--no-padding', `taxes-amount__${className}-line-label`]),
            price: classNames(['taxes-amount__price', `taxes-amount__${className}-line-price`]),
            delete: classNames(['taxes-amount__delete']),
            loading: classNames(['taxes-amount__loading']),
            loadingSpan: classNames(['taxes-amount__loading-span'])
        }
    };
}
