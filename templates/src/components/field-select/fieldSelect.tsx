import React, {useCallback, useMemo, useState} from 'react';
import {SelectField} from '@boldcommerce/stacks-ui/lib/';
import ClassNames from 'classnames';
import {IFieldSelectProps} from 'src/types';

export function FieldSelect(props: IFieldSelectProps): React.ReactElement {

    const [isFocus, setIsFocus] = useState<boolean>(false);

    const handleFocus = useCallback(evt => {
        setIsFocus(true);
        if (props.handleFocus) {
            props.handleFocus(evt);
        }
    },[]);

    const handleBlur = useCallback(evt => {
        setIsFocus(false);
        if (props.handleBlur) {
            props.handleBlur(evt);
        }
    },[]);

    const cssClass = useMemo(() =>  ClassNames([
        'select-field__container',
        props.className,
        {'select-field--has-value': props.value && props.value.length > 0},
        {'select-field--has-focus': isFocus},
    ]), [props.className, props.value, isFocus]);

    return (
        <div className={cssClass} data-testid='input-select__container'>
            <SelectField
                className={'select-field'}
                data-testid='input-select'
                id={props.id}
                name={props.name}
                onChange={props.handleChange}
                value={props.value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                messageType = {props.errorMessage ? 'alert' : ''}
                messageText = {props.errorMessage ? props.errorMessage : ''}
            >
                {(props.placeholder === null || props.placeholder === '') ? null :
                    <option data-testid='input-select__options' value="" disabled={props.isPlaceholderDisabled}>
                        { props.placeholder }
                    </option>
                }
                {
                    props.options.map(item => <option data-testid='input-select__options' key={item.value} value={ item.value }>{ item.name }</option>)
                }
            </SelectField>
            <span data-testid='input-select__label' className={ClassNames(['select-field__label', {'field--alert' : props.errorMessage} ])}>{props.label}</span>
        </div>
    );
}
