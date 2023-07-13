import React from 'react';
import {ILifeFieldProps} from 'src/types';
import {FieldTextArea} from 'src/components';
import {useLifeFieldTextInput} from 'src/hooks';
import {TEXTAREA_MAX_LENGTH} from 'src/constants';
export function LifeFieldTextarea(props: ILifeFieldProps): React.ReactElement {
    const {inputValue, label, placeHolder, id, handleChange} = useLifeFieldTextInput(props.lifeField);

    return (
        <div className={'life-field-textarea'} key={id}>
            <FieldTextArea
                label={label}
                name={id}
                value={inputValue || ''}
                placeholder={placeHolder}
                className='life-field-textarea-element'
                onChange={handleChange}
                id={id}
                maxLength={TEXTAREA_MAX_LENGTH}
                data-testid={`${id}-life-field-textarea`}/>
        </div>
    );
}
