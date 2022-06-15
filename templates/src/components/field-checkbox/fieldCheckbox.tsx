import React from 'react';
import {CheckboxField} from '@boldcommerce/stacks-ui';
import {IFieldCheckboxProps } from 'src/types';
import {useGetIsLoading} from 'src/hooks';

export function FieldCheckbox(props: IFieldCheckboxProps): React.ReactElement {
    const isLoading = useGetIsLoading();
    return (
        <CheckboxField
            data-testid='field-checkbox'
            label={props.label}
            className={props.className}
            checked={props.checked}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
            disabled={isLoading}
        />
    );
}
