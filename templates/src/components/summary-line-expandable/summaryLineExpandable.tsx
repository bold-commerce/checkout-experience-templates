import React from 'react';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryLineExpandable} from 'src/types';
import {SummaryLineExpanded} from 'src/components';
import {useSummaryLineExpandable} from 'src/hooks';
import {Constants} from 'src/constants';

export function SummaryLineExpandable(props: ISummaryLineExpandable): React.ReactElement {
    const {expand, classes, toggle, fieldNames, formattedPrice} = useSummaryLineExpandable(props);

    return (
        <div className={classes.container}>
            <div className={classes.title.container}>
                <button className={classes.title.arrow} onClick={toggle}/>
                <span className={classes.title.text}>{props.title}</span>
                {!expand && <Price className={classes.list.price} moneyFormatString={formattedPrice} amount={props.total} textAlign={'right'}/>}
            </div>
            {
                expand && props.content && Array.isArray(props.content) && props.content.length > 0 && props.content.map((item, index) => {
                    let itemAmount = item[fieldNames.amount];
                    if(props.eventToggleName === Constants.PAYMENTS_TOGGLE) { // TODO: Remove condition after FF CE-539-Add-PaymentLine-Model is Enabled by default
                        itemAmount = item[fieldNames.amount] && item['value'] ? item['value'] : item[fieldNames.amount];
                    }
                    return (
                        <SummaryLineExpanded
                            key={`summary-line-expanded-${props.eventToggleName}-${index}`}
                            eventToggleName={props.eventToggleName}
                            amount={itemAmount}
                            content={item}
                            id={`${index}`}
                            classes={classes}
                            hasDeleteButton={props.hasDeleteButton}
                            itemId={fieldNames.id ? item[fieldNames.id] : ''}
                            eventDeleteName={props.eventDeleteName}
                        />);
                })
            }
            {
                expand && props.content && Array.isArray(props.content) && props.content.length <= 0 && <div className={'summary-line--no-line'}>No {props.title} found</div>
            }
        </div>

    );
}
