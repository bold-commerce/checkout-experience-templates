import React from 'react';
import {ILineWithTextProp} from 'src/types';

export function TextWithCenterLine(props: ILineWithTextProp): React.ReactElement {
    return (
        <div className="text-with-center-line">
            <div />
            <span className="text-with-center-line__content">{props.text}</span>
            <div />
        </div>);
}
