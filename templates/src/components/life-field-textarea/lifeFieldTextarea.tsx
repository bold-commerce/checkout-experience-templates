import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldTextArea} from 'src/components';
import {useLifeFieldTextInput} from 'src/hooks';
import {TEXTAREA_MAX_LENGTH} from 'src/constants';
export function LifeFieldTextarea(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, label, placeHolder, id, errorMessage, handleChange} = useLifeFieldTextInput(props.lifeField);

    return (
        <div className={'life-element-textarea-container'} key={id}  id={`life-element-textarea-container-${id}`}  data-testid={`life-element-textarea-container-${id}`}>
            <FieldTextArea
                label={label}
                name={id}
                value={inputValue || ''}
                placeholder={placeHolder}
                className='life-element-textarea'
                onChange={handleChange}
                id={`life-element-textarea-${id}`}
                maxLength={TEXTAREA_MAX_LENGTH}
                errorMessage={errorMessage}/>
        </div>
    );
}
