import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldCheckbox} from 'src/components';
import {useLifeFieldCheckbox} from 'src/hooks';

export function LifeFieldCheckbox(props: ILifeFieldProps): React.ReactElement {
    const {checked, value, label, helpText, id, errorMessage, handleChange} = useLifeFieldCheckbox(props.lifeField);

    return (
        <div id={`life-element-checkbox-container-${id}`} className={'life-element-checkbox-container'} data-testid={`life-element-checkbox-container-${id}`} key={id}>
            <FieldCheckbox
                label={label}
                value={value}
                helpText={helpText}
                id={`life-element-checkbox-${id}`}
                className='life-element-checkbox'
                checked={checked}
                handleChange={handleChange}
                errorMessage={errorMessage}
            />
        </div>
    );
}
