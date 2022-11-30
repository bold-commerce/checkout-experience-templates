import ClassNames from 'classnames';
import React from 'react';

import {IOrderRecapDisplayItemProps} from 'src/types';

export function RecapDisplayItem(props: IOrderRecapDisplayItemProps): React.ReactElement {
    const cssClass = ClassNames(['recap-display-item', props.className]);

    return (
        <div className={cssClass}>
            <div className={'recap-display-item__title'}>{props.title}</div>
            <div className={'recap-display-item__content'}>
                {props.children}
            </div>
        </div>
    );
}
