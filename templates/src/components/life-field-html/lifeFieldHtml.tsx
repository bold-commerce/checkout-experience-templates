import React from 'react';
import {ILifeFieldProps} from 'src/types';

export function LifeFieldHtml(props: ILifeFieldProps): React.ReactElement {
    const html = props.lifeField.input_default ?? '';
    const id = props.lifeField.public_id;

    return (
        <div className={'life-element-html-container'} key={id} id={`life-element-html-container-${id}`} data-testid={`life-element-html-container-${id}`}>
            <div
                id={`life-element-html-${id}`}
                className={'life-element-html'}
                dangerouslySetInnerHTML={{__html: html}}
            />
        </div>
    );
}
