import React, {useMemo} from 'react';
import {Field} from '@boldcommerce/stacks-ui';
import {IFieldTextareaProps} from 'src/types';
import {Textarea} from 'src/components';
import ClassNames from 'classnames';
import {useGetIsLoadingExceptSections} from 'src/hooks';

export function FieldTextArea(props: IFieldTextareaProps): React.ReactElement {
    const isLoading = useGetIsLoadingExceptSections();
    const cssClass = useMemo(() => ClassNames([
        'textarea-field__container',
        props.className,
        {'textarea-field--has-value': props.value && props.value.length > 0},
    ]), [props.className, props.value]);

    return (
        <div className={cssClass}  data-testid='textarea-field__container'>
            <Field
                htmlFor={props.id}
                className={'textarea-field'}
                messageType={props.messageType ? 'alert' : ''}
                messageText={props.messageText ? props.messageText : ''}
                disabled={props.disabled}
                readOnly={props.readOnly}
                ariaLive='polite'
            >
                <Textarea
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    placeholder={props.placeholder}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    autoComplete={props.autoComplete}
                    disabled={isLoading}
                    readOnly={props.readOnly}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    onKeyUp={props.onKeyUp}
                    onKeyDown={props.onKeyDown}
                    onChange={props.onChange}
                    messageType={props.messageType ? 'alert' : ''}
                    testId={props.testId}
                />
            </Field>
            <label htmlFor={props.id} data-testid='textarea-field__label' className={ClassNames(['textarea-field__label', {'field--alert': props.messageText}])}>{props.label}</label>
        </div>
    );
}
