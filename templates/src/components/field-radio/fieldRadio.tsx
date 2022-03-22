import React from 'react';
import {RadioField} from '@boldcommerce/stacks-ui/lib/';
import {IFieldRadioProps} from 'src/types';

export function FieldRadio(props: IFieldRadioProps): React.ReactElement {
    return (
        <RadioField
            data-testid='field-radio'
            label={props.label}
            className={props.className}
            checked={props.checked}
            name={props.name}
            value={props.value}
            onChange={props.handleChange}
        />
    );
}
