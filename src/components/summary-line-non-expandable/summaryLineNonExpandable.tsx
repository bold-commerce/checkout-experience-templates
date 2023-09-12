import React from 'react';
import {getClassesListSummary} from 'src/utils';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryLineNonExpandable} from 'src/types';
import {useAppSelector, useGetCurrencyInformation} from 'src/hooks';
import {Constants} from 'src/constants';

export function SummaryLineNonExpandable(props: ISummaryLineNonExpandable): React.ReactElement {
    const classes = getClassesListSummary(props.eventName, false, !!props.hasBottom, false);
    const {formattedPrice} = useGetCurrencyInformation(props.eventName === Constants.TOTAL_EVENT);
    const lowerCleanEventName = props.eventName.replace('_EVENT', '').toLowerCase();
    const displayExchangeRate: number = useAppSelector((state) => state.data.application_state?.display_exchange_rate);
    const displayTotal = displayExchangeRate ? displayExchangeRate * props.total : props.total;

    return (
        <div className={classes.container} data-testid={`summary-line__${lowerCleanEventName}-container`}>
            <div className={classes.title.container} data-testid={`summary-line__${lowerCleanEventName}-title`}>{props.name}</div>
            <Price
                className={classes.title.price}
                moneyFormatString={formattedPrice}
                amount={displayTotal} textAlign={'right'}
                data-testid={`summary-line__${lowerCleanEventName}-price`}
            />
        </div>
    );
}
