import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldSelect} from 'src/components';
import {useLifeFieldSelect} from 'src/hooks';

export function LifeFieldSelect(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, label, placeholder, options, id, errorMessage, handleChange} = useLifeFieldSelect(props.lifeField);

    return (
        <div className={'life-field-select'}>
            <FieldSelect
                className='life-field-select-element'
                data-testid={`${id}-life-field-select`}
                label={label}
                id={id}
                placeholder={placeholder}
                isPlaceholderDisabled={true}
                handleChange={handleChange}
                errorMessage={errorMessage}
                value={inputValue}
                options={options}
            />
        </div>
    );
}
