import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldInput} from 'src/components';
import {useLifeFieldTextInput} from 'src/hooks';

export function LifeFieldText(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, placeHolder, id, errorMessage, handleChange} = useLifeFieldTextInput(props.lifeField);

    return (
        <div className={'life-field-text'} key={id}>
            <FieldInput
                name={id}
                value={inputValue || ''}
                placeholder={placeHolder}
                className='life-field-text-element'
                handleChange={handleChange}
                id={id}
                data-testid={`${id}-life-field-text`}
                errorMessage={errorMessage}
            />
        </div>
    );
}
