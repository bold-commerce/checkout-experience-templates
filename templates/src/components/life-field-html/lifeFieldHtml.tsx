import React from 'react';
import {ILifeFieldProps} from 'src/types';

export function LifeFieldHtml(props: ILifeFieldProps): React.ReactElement {
    const label = props.lifeField.input_label ?? '';
    const href = props.lifeField.input_default ?? '';
    const id = props.lifeField.public_id;
    const data = `<a href=${href} target="_blank">${label}</a>`;

    return (
        <div className={'life-field-html'} key={id} id={id}  data-testid={`${id}-life-field-html`} >
            <div className={'life-field-html-link'} dangerouslySetInnerHTML={{__html: data}}/>
        </div>
    );
}
