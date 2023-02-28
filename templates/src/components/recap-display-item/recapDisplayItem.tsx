import ClassNames from 'classnames';
import React from 'react';

import {IOrderRecapDisplayItemProps} from 'src/types';

export function RecapDisplayItem(props: IOrderRecapDisplayItemProps): React.ReactElement {
    const cssClass = ClassNames(['recap-display-item', props.className]);

    return (
        <div className={cssClass} data-testid={`display-item-${props.testDataId}-container`}>
            <div className={'recap-display-item__title'} data-testid={`display-item-${props.testDataId}-title`}>{props.title}</div>
            <div className={'recap-display-item__content'} data-testid={`display-item-${props.testDataId}-content`}>
                {props.children}
            </div>
        </div>
    );
}
