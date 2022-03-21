import React from 'react';
import {CheckboxField} from '@boldcommerce/stacks-ui';
import {IFieldCheckboxProps } from 'src/types';

export function FieldCheckbox(props: IFieldCheckboxProps): React.ReactElement {
    return (
        <CheckboxField
            data-testid='field-checkbox'
            label={props.label}
            className={props.className}
            checked={props.checked}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
        />
    );
}
