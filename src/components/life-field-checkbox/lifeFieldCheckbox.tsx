import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldCheckbox} from 'src/components';
import {useLifeFieldCheckbox} from 'src/hooks';

export function LifeFieldCheckbox(props: ILifeFieldProps): React.ReactElement {
    const {checked, value, label, helpText, id, handleChange} = useLifeFieldCheckbox(props.lifeField);

    return (
        <div className={'life-field-checkbox'}  key={id}>
            <FieldCheckbox
                label={label}
                value={value}
                helpText={helpText}
                data-testid={`${id}-life-field-checkbox`}
                checked={checked}
                handleChange={handleChange}
            />
        </div>
    );
}
