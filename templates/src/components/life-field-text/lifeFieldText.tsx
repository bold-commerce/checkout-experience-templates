import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldInput} from 'src/components';
import {useLifeFieldTextInput} from 'src/hooks';

export function LifeFieldText(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, placeHolder, id, errorMessage, handleChange} = useLifeFieldTextInput(props.lifeField);

    return (
        <div className={'life-element-text-container'} key={id} id={`life-element-text-container-${id}`} data-testid={`life-element-text-container-${id}`}>
            <FieldInput
                name={id}
                value={inputValue || ''}
                placeholder={placeHolder}
                className='life-element-text'
                handleChange={handleChange}
                id={`life-element-text-${id}`}
                errorMessage={errorMessage}
            />
        </div>
    );
}
