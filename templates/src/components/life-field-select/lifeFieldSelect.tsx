import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldSelect} from 'src/components';
import {useLifeFieldSelect} from 'src/hooks';

export function LifeFieldSelect(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, label, placeholder, options, id, errorMessage, handleChange} = useLifeFieldSelect(props.lifeField);

    return (
        <div
            className={'life-element-select-container'} key={id} id={`life-element-select-container-${id}`} data-testid={`life-element-select-container-${id}`}>
            <FieldSelect
                className='life-element-select'
                label={label}
                id={`life-element-select-${id}`}
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
