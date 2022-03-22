import React from 'react';
import {ILockedSectionProps} from 'src/types';

export function LockedSection(props: ILockedSectionProps): React.ReactElement{
    return (
        <div className={props.classNameSection}>
            <label className={props.className}>{props.text}</label>
        </div>
    );
}
