import React, { useMemo } from 'react';
import { InputField } from '@boldcommerce/stacks-ui/lib';
import ClassNames from 'classnames';
import {useGetIsLoading} from 'src/hooks';
import { IFieldInputProps } from 'src/types';

export function FieldInput(props: IFieldInputProps): React.ReactElement {
    const isLoading = useGetIsLoading();
    const cssClass = useMemo(() => ClassNames([
        'input-field__container',
        props.className,
        { 'input-field--has-value': props.value && props.value.length > 0 },
    ]), [props.className, props.value]);

    return (
        <div className={cssClass} data-testid='input-field__container'>
            <InputField
                ariaLive="polite"
                type={props.type}
                data-testid='input-field'
                className={'input-field'}
                label={props.label}
                id={props.id}
                value={props.value}
                name={props.name}
                placeholder={props.placeholder}
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                messageType={props.errorMessage ? 'alert' : ''}
                messageText={props.errorMessage ? props.errorMessage : ''}
                autoFocus={props.autoFocus}
                disabled={isLoading}
            />
            <span data-testid='input-field__label' className={ClassNames(['input-field__label', { 'field--alert': props.errorMessage }])}>{props.placeholder}</span>
        </div>
    );
}
