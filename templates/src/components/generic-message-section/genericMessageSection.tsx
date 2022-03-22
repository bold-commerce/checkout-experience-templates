import ClassNames from 'classnames';
import React from 'react';

import {IGenericMessageSectionProps} from 'src/types';

export function GenericMessageSection(props: IGenericMessageSectionProps): React.ReactElement {
    const cssClass = ClassNames(['generic-message-section', props.className]);

    return (
        <div className={cssClass}>
            {props.sectionTitle && <div className={'generic-message-section__section-title'}>{props.sectionTitle}</div>}
            <div className={'generic-message-section__message-container'}>
                <div className={'generic-message-section__message-title'}>{props.messageTitle}</div>
                <div className={'generic-message-section__message-text'}>{props.messageText}</div>
            </div>
        </div>
    );
}
