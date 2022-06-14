import React, {useCallback, useMemo, useState} from 'react';
import {SelectField} from '@boldcommerce/stacks-ui/lib';
import ClassNames from 'classnames';
import {IFieldSelectProps} from 'src/types';
import {useGetIsLoading} from 'src/hooks';

export function FieldSelect(props: IFieldSelectProps): React.ReactElement {
    const isLoading = useGetIsLoading();
    const [isFocus, setIsFocus] = useState(false);

    const handleFocus = useCallback(evt => {
        setIsFocus(true);
        props.handleFocus?.(evt);
    }, [props.handleFocus]);

    const handleBlur = useCallback(evt => {
        setIsFocus(false);
        props.handleBlur?.(evt);
    }, [props.handleBlur]);

    const cssClass = useMemo(() =>  ClassNames([
        'select-field__container',
        props.className,
        {'select-field--has-value': props.value && props.value.length > 0},
        {'select-field--has-focus': isFocus},
    ]), [props.className, props.value, isFocus]);

    return (
        <div className={cssClass} data-testid="input-select__container">
            <SelectField
                className="select-field"
                data-testid="input-select"
                id={props.id}
                name={props.name}
                onChange={props.handleChange}
                value={props.value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                ariaLive="assertive"
                messageType={props.errorMessage ? 'alert' : ''}
                messageText={props.errorMessage ? props.errorMessage : ''}
                disabled={isLoading}
            >
                {props.placeholder && (
                    <option data-testid="input-select__options" value={props.placeholderValue ?? ''} disabled={props.isPlaceholderDisabled}>
                        {props.placeholder}
                    </option>
                )}
                {props.options.map(item =>
                    <option data-testid="input-select__options" key={item.value} value={item.value}>{item.name}</option>
                )}
            </SelectField>
            <span data-testid="input-select__label" className={ClassNames('select-field__label', {'field--alert': props.errorMessage})}>{props.label}</span>
        </div>
    );
}
