import React from 'react';
import {Price} from '@boldcommerce/stacks-ui';
import {ISummaryLineExpanded} from 'src/types';
import {useSummaryLineExpanded} from 'src/hooks';


export function SummaryLineExpanded(props: ISummaryLineExpanded): React.ReactElement {
    const {textAlign, eventDeleteName, itemId, deleteElementFromState, closeLoading, isLoading, formattedPrice}  = useSummaryLineExpanded(props);

    return (
        <div className={props.classes.list.li}>
            <div className={props.classes.list.text}>
                {props.content}
                {!isLoading && props.hasDeleteButton ?
                    closeLoading ?
                        <div className={props.classes.list.loading}> <span className={props.classes.list.loadingSpan}/> </div> :
                        <button data-testid='delete-discount'  className={props.classes.list.delete} onClick={() => deleteElementFromState(eventDeleteName, itemId)} />
                    : null}
            </div>
            <Price className={props.classes.list.price} moneyFormatString={formattedPrice} amount={props.amount} textAlign={textAlign}/>
        </div>
    );
}
