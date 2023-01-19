import React from 'react';
import {RadioField} from '@boldcommerce/stacks-ui/lib/';
import {IFieldRadioProps} from 'src/types';
import {useGetIsLoadingExceptSections} from 'src/hooks';

export function FieldRadio(props: IFieldRadioProps): React.ReactElement {
    const isLoading = useGetIsLoadingExceptSections();
    return (
        <RadioField
            data-testid='field-radio'
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
