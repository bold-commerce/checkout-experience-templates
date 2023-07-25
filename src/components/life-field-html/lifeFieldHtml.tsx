import React from 'react';
import {ILifeFieldProps} from 'src/types';

export function LifeFieldHtml(props: ILifeFieldProps): React.ReactElement {
    const html = props.lifeField.input_default ?? '';
    const id = props.lifeField.public_id;

    return (
        <div className={'life-field-html'} key={id} id={id}  data-testid={`${id}-life-field-html`} >
            <div className={'life-field-html-link'} dangerouslySetInnerHTML={{__html: html}}/>
        </div>
    );
}
