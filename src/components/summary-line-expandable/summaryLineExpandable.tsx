import React from 'react';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryLineExpandable} from 'src/types';
import {SummaryLineExpanded} from 'src/components';
import {useSummaryLineExpandable} from 'src/hooks';
import {Constants, PLUGIN_BACKEND_DISCOUNT_SOURCE} from 'src/constants';

export function SummaryLineExpandable(props: ISummaryLineExpandable): React.ReactElement {
    const {expand, classes, toggle, fieldNames, formattedPrice} = useSummaryLineExpandable(props);

    const hasChildLines = props.content && Array.isArray(props.content) && props.content.length > 0;

    const childLineDetails = hasChildLines && props.content.map((item, index) => {
        let itemAmount = item[fieldNames.amount];
        if(props.eventToggleName === Constants.PAYMENTS_TOGGLE) { // TODO: Remove condition after FF CE-539-Add-PaymentLine-Model is Enabled by default
            itemAmount = item[fieldNames.amount] && item['value'] ? item['value'] : item[fieldNames.amount];
        }
        const key = `summary-line-expanded-${props.eventToggleName}-${index}`;
        const displayDeleteButton = 'source' in item ? item.source !== PLUGIN_BACKEND_DISCOUNT_SOURCE && props.hasDeleteButton : props.hasDeleteButton;

        return {item, itemAmount, key, displayDeleteButton};
    }) || [];

    const titleId = `summary-line-${props.eventToggleName}-title`;

    return (
        <div className={classes.container}>
            <div className={classes.title.container}>
                <button
                    className={classes.title.arrow}
                    onClick={toggle}
                    aria-expanded={expand}
                    aria-describedby={titleId}
                    aria-controls={childLineDetails.map(line => line.key).join()}
                />
                <span className={classes.title.text} id={titleId}>{props.title}</span>
                {!expand && <Price className={classes.list.price} moneyFormatString={formattedPrice} amount={props.total} textAlign={'right'} />}
            </div>
            {
                expand && childLineDetails.map(({item, key, itemAmount, displayDeleteButton}) => {
                    return (
                        <SummaryLineExpanded
                            key={key}
                            eventToggleName={props.eventToggleName}
                            amount={itemAmount}
                            content={item}
                            id={key}
                            classes={classes}
                            hasDeleteButton={displayDeleteButton}
                            itemId={fieldNames.id ? item[fieldNames.id] : ''}
                            eventDeleteName={props.eventDeleteName}
                        />);
                })
            }
            {
                expand && !hasChildLines && <div className={'summary-line--no-line'}>No {props.title} found</div>
            }
        </div>

    );
}
