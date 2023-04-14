import React from 'react';
import {CheckboxField} from '@boldcommerce/stacks-ui';
import {IFieldCheckboxProps} from 'src/types';
import {useGetIsLoadingExceptSections} from 'src/hooks';

export function FieldCheckbox(props: IFieldCheckboxProps): React.ReactElement {
    const isLoading = useGetIsLoadingExceptSections();
    return (
        <CheckboxField
            data-testid={props.dataTestId}
            label={props.label}
            helpText={props.helpText}
            className={props.className}
            checked={props.checked}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
            disabled={isLoading}
        />
    );
}
