import React from 'react';
import {IAddressSavedSelectProps as IAddressSavedSelectProps} from 'src/types';
import { FieldSelect} from 'src/components';
import {useGetSavedAddressData} from 'src/hooks';

export function AddressSavedSelect(props: IAddressSavedSelectProps): React.ReactElement {
    const { id, label, options, selectedOptionId, placeholder, handleChange } = useGetSavedAddressData(props.type);

    return (
        <FieldSelect
            placeholder={placeholder}
            placeholderValue={props.placeholderValue}
            className={props.className}
            options={options}
            label={label}
            value={props.autoSelect ? (selectedOptionId ?? '') : undefined}
            handleChange={handleChange}
            id={id}
        />
    );
}
