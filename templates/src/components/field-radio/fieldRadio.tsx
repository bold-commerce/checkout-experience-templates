import React from 'react';
import {RadioField} from '@boldcommerce/stacks-ui/lib/';
import {IFieldRadioProps} from 'src/types';
import {useGetIsLoading} from 'src/hooks';

export function FieldRadio(props: IFieldRadioProps): React.ReactElement {
    const isLoading = useGetIsLoading();
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
