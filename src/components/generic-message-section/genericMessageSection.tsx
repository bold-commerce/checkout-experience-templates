import ClassNames from 'classnames';
import React from 'react';

import {IGenericMessageSectionProps} from 'src/types';
import {useGetLifeFields} from 'src/hooks';
import {LifeInputLocationConstants} from 'src/constants';
import {LifeFields} from 'src/components';

export function GenericMessageSection(props: IGenericMessageSectionProps): React.ReactElement {
    const cssClass = ClassNames(['generic-message-section', props.className]);
    const thankYouMessageLifeFields = useGetLifeFields(LifeInputLocationConstants.THANK_YOU_MESSAGE);
    const thankYouMessageLifeFieldsClassNames = ClassNames(['generic-message-section__life-element', 'thank-you-message-life-elements']);


    return (
        <div className={cssClass}>
            {props.sectionTitle && <div className={'generic-message-section__section-title'}>{props.sectionTitle}</div>}
            {props.orderConfirmation ? <LifeFields className={thankYouMessageLifeFieldsClassNames} lifeFields={thankYouMessageLifeFields}/> : null}
            <div className={'generic-message-section__message-container'}>
                <div className={'generic-message-section__message-title'}>{props.messageTitle}</div>
                <div className={'generic-message-section__message-text'}>{props.messageText}</div>
            </div>
        </div>
    );
}
