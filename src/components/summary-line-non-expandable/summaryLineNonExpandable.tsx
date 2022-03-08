import React from 'react';
import {getClassesListSummary} from 'src/utils';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryLineNonExpandable} from 'src/types';
import {useGetCurrencyInformation} from 'src/hooks';
import {Constants} from 'src/constants';

export function SummaryLineNonExpandable(props: ISummaryLineNonExpandable): React.ReactElement {
    const classes = getClassesListSummary(props.eventName, false, !!props.hasBottom, false);
    const {formattedPrice} = useGetCurrencyInformation(props.eventName === Constants.TOTAL_EVENT);

    return (
        <div className={classes.container}>
            <div className={classes.title.container}>{props.name}</div>
            <Price className={classes.title.price} moneyFormatString={formattedPrice} amount={props.total} textAlign={'right'}/>
        </div>
    );
}
