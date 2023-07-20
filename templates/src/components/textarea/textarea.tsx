import React, {useState} from 'react';
import {ITextareaProps} from 'src/types';
import cn from 'classnames';

export function Textarea(props: ITextareaProps): React.ReactElement {
    const [hasFocus, setHasFocus] = useState<boolean>(false);

    return (
        <div
            className={
                cn([
                    'textarea',
                    {
                        'textarea--alert': props.messageType === 'alert',
                        'textarea--warning': props.messageType === 'warning',
                        'textarea--success': props.messageType === 'success',
                        'textarea--has-focus': hasFocus,
                        'textarea--disabled': props.disabled,
                    },
                    props.className,
                ])
            }
        >
            <textarea
                id={props.id}
                className="textarea__textarea-element"
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                minLength={props.minLength}
                maxLength={props.maxLength}
                autoComplete={props.autoComplete}
                disabled={props.disabled}
                readOnly={props.readOnly}
                onFocus={(evt) => {
                    setHasFocus(true);

                    if (props.onFocus) {
                        props.onFocus(evt);
                    }
                }}
                onBlur={(evt) => {
                    setHasFocus(false);
                    if (props.onBlur) {
                        props.onBlur(evt);
                    }
                }}
                onChange={(evt)=> {
                    if (props.onChange) {
                        props.onChange(evt);
                    }
                }}
                onKeyUp={props.onKeyUp}
                onKeyDown={props.onKeyDown}
                data-testid={props.testId}
            />
        </div>
    );
}
